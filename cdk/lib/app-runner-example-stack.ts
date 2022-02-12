import * as cdk from '@aws-cdk/core'
import * as ecr from '@aws-cdk/aws-ecr'
import { AppRunner } from './app-runner'
import { Network } from './network'
import { Rds } from './rds'

export class AppRunnerExampleStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // ECR
    const repository = new ecr.Repository(this, 'AppRunnerExampleRepository', {
      imageScanOnPush: true,
    })
    // VPC
    const { vpc, dbSecurityGroup } = new Network(this, 'Network')

    // RDS
    new Rds(this, 'Rds', { vpc, dbSecurityGroup })

    // AppRunner
    new AppRunner(this, 'AppRunner', { repository })
  }
}
