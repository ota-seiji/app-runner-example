import * as cdk from '@aws-cdk/core'
import * as rds from '@aws-cdk/aws-rds'
import * as ec2 from '@aws-cdk/aws-ec2'

interface RdsProps {
  vpc: ec2.Vpc
  dbSecurityGroup: ec2.SecurityGroup
}

export class Rds extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: RdsProps) {
    super(scope, id)

    const { vpc, dbSecurityGroup } = props

    const rdsCredentials = rds.Credentials.fromGeneratedSecret(
      'appRunnerExample',
      { secretName: 'AppRunnerExampleDbSecret' }
    )

    new rds.DatabaseCluster(
      scope,
      'AppRunnerExampleDbCluster',
      {
        engine: rds.DatabaseClusterEngine.auroraPostgres({
          version: rds.AuroraPostgresEngineVersion.VER_12_4,
        }),
        credentials: rdsCredentials,
        instances: 1,
        instanceProps: {
          instanceType: ec2.InstanceType.of(
            ec2.InstanceClass.BURSTABLE3,
            ec2.InstanceSize.MEDIUM
          ),
          vpc,
          vpcSubnets: vpc.selectSubnets({ subnetGroupName: 'DB' }),
          securityGroups: [dbSecurityGroup],
        },
        defaultDatabaseName: 'appRunnerExample',
      }
    )
  }
}
