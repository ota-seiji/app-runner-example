import * as cdk from '@aws-cdk/core'
import * as iam from '@aws-cdk/aws-iam'
import * as apprunner from '@aws-cdk/aws-apprunner'
import * as ecr from '@aws-cdk/aws-ecr'
import * as secretsmanager from '@aws-cdk/aws-secretsmanager'

interface AppRunnerProps {
  repository: ecr.Repository
}

export class AppRunner extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: AppRunnerProps) {
    super(scope, id)

    const { repository } = props

    // Roles
    const instanceRole = new iam.Role(scope, 'AppRunnerInstanceRole', {
      assumedBy: new iam.ServicePrincipal('tasks.apprunner.amazonaws.com'),
    })

    const accessRole = new iam.Role(scope, 'AppRunnerAccessRole', {
      assumedBy: new iam.ServicePrincipal('build.apprunner.amazonaws.com'),
    })

    const secret = secretsmanager.Secret.fromSecretNameV2(
      scope,
      'AppRunnerExampleDbSecret',
      'AppRunnerExampleDbSecret'
    )

    secret.secretValueFromJson('username').toString()

    // Apprunner
    new apprunner.Service(scope, 'AppRunnerExampleService', {
      source: apprunner.Source.fromEcr({
        imageConfiguration: {
          port: 3000,
          environment: {
            // DBの接続情報を環境変数へ格納
            dbUserName: secret.secretValueFromJson('username').toString(),
            dbPassword: secret.secretValueFromJson('password').toString(),
            dbHost: secret.secretValueFromJson('host').toString(),
            dbPort: secret.secretValueFromJson('port').toString(),
            dbName: secret.secretValueFromJson('dbname').toString(),
          },
        },
        repository,
        tag: 'latest',
      }),
      instanceRole: instanceRole,
      accessRole: accessRole,
    })
  }
}
