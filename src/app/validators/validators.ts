import { FormControl } from '@angular/forms';

export const confirmPassword = (control: FormControl) => {

  if (control.value === control.root.value.password || control.value === control.root.value.newPassword) {
    return null;
  } else {
    return { isNotConfirmed: true };
  }

};
