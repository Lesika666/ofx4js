/*
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

"use strict";

/**
 * Types of well-known sub-accounts.
 * See "Section 13.9.2.4.2, OFX Spec"
 *
 * @enum
 */
var SubAccountType = {
  CASH: "CASH",
  MARGIN: "MARGIN",
  SHORT: "SHORT",
  OTHER: "OTHER",

  fromOfx: function(/*String*/ ofxVal) {
    if ("CASH" === ofxVal) {
      return SubAccountType.CASH;
    } else if ("MARGIN" === ofxVal) {
      return SubAccountType.MARGIN;
    } else if ("SHORT" === ofxVal) {
      return SubAccountType.SHORT;
    } else if ("OTHER" === ofxVal) {
      return SubAccountType.OTHER;
    } else {
      return null;
    }
  }
};


module.exports = SubAccountType;
