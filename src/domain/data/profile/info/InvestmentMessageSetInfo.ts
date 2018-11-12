/*
 * Copyright 2008 Web Cohesion
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { AbstractMessageSetInfo } from "../AbstractMessageSetInfo";
import { InvestmentV1MessageSetInfo } from "./InvestmentV1MessageSetInfo";
import { Aggregate_add } from "../../../../meta/Aggregate_Add";
import { ChildAggregate_add } from "../../../../meta/ChildAggregate_add";


/**
 * @author Ryan Heaton
 */
export class InvestmentMessageSetInfo extends AbstractMessageSetInfo {

  private version1Info: InvestmentV1MessageSetInfo;

  public getVersion1Info(): InvestmentV1MessageSetInfo {
    return this.version1Info;
  }

  public setVersion1Info(version1Info: InvestmentV1MessageSetInfo): void {
    this.version1Info = version1Info;
  }
}

Aggregate_add( InvestmentMessageSetInfo, "INVSTMTMSGSET" );
ChildAggregate_add(InvestmentMessageSetInfo, { order: 0, type: InvestmentV1MessageSetInfo, read: InvestmentMessageSetInfo.prototype.getVersion1Info, write: InvestmentMessageSetInfo.prototype.setVersion1Info });
