import * as cdk from '@aws-cdk/core'
import * as ec2 from '@aws-cdk/aws-ec2'

export class Network extends cdk.Construct {
  readonly vpc: ec2.Vpc
  readonly dbSecurityGroup: ec2.SecurityGroup

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id)

    this.vpc = new ec2.Vpc(this, 'VPC', {
      cidr: '10.0.0.0/16',
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'DB',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
      natGateways: 0,
    })

    const AppRunnerSecurityGroup = new ec2.SecurityGroup(
      this,
      'AppRunnerSecurityGroup',
      {
        securityGroupName: 'app-runner-example-sg-ar',
        vpc: this.vpc,
      }
    )

    this.dbSecurityGroup = new ec2.SecurityGroup(this, 'DBSecurityGroup', {
      allowAllOutbound: true,
      securityGroupName: 'app-runner-example-sg-db',
      vpc: this.vpc,
    })
    this.dbSecurityGroup.addIngressRule(
      AppRunnerSecurityGroup,
      ec2.Port.tcp(5432)
    )
  }
}
