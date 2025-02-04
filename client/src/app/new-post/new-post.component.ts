import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../services/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent {
  postForm: FormGroup;

  constructor(private fb: FormBuilder, private postService: PostService, private router: Router) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(75), this.titleValidator]],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(350), this.contentValidator]],
    });
  }

  titleValidator(control: FormControl): { [key: string]: boolean } | null {
    const title = control.value;
    if (title && !/^[a-zA-Z0-9\s.,!?-]+$/.test(title)) {
      return { 'invalidTitle': true };
    }
    return null;
  }

  contentValidator(control: FormControl): { [key: string]: boolean } | null {
    const content = control.value;
    if (content && !/^[a-zA-Z0-9\s.,!?-]+(\n|\r\n)?$/gm.test(content)) {
      return { 'invalidContent': true };
    }
    return null;
  }

  async submit() {
    try {
      if (this.postForm.valid) {
        const response: any = await this.postService.createPost(this.postForm.value);
        console.log('Post created:', response);
        this.router.navigate(['/posts']);
      }
    } catch (e) {
      console.error('Error creating post', e);
    }
  }
}
