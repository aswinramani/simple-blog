import { FormControl } from "@angular/forms";

export interface PostForm {
    title: FormControl<string | null>;
    content: FormControl<string | null>;
};
