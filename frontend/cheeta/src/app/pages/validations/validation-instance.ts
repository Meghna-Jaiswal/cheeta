import { Validation } from "./create.validation";

/**
 * Create Validation instance and extends functions of validations
 */

export class CreateValidation extends Validation {
  public errorMessage: string = '';

  public isError(): any {
    if (this.errorMessage != "") {return true;}
    if (this.errorMessage == "") return false;
  }

  public isValid(): any {
    if (this.isError()) return false;
    if (!this.isError()) return true;
  }
}
