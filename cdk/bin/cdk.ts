#!/usr/bin/env node
import * as cdk from '@aws-cdk/core'
import { AppRunnerExampleStack } from '../lib/app-runner-example-stack'

const app = new cdk.App()
new AppRunnerExampleStack(app, 'AppRunnerExampleStack')
