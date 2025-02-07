import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../services/post.service';
import { Router } from '@angular/router';
import { PostForm } from '../interfaces/PostForm';
import { CustomFormValidator } from '../interfaces/CustomFormValidator';
import { Post } from '../interfaces/Post';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent {
  postForm: FormGroup<PostForm>;

  constructor(
    private fb: FormBuilder,
    private readonly postService: PostService, 
    private readonly router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(75), this.titleValidator]],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(350), this.contentValidator]],
    });
  }

  titleValidator(control: FormControl): CustomFormValidator {
    const title = control.value;
    if (title && !/^[a-zA-Z0-9\s.,!?-]+$/.test(title)) {
      return { 'invalidTitle': true };
    }
    return { 'invalidTitle': false };;
  }

  contentValidator(control: FormControl): CustomFormValidator {
    const content = control.value;
    if (content && !/^[a-zA-Z0-9\s.,!?-]+(\n|\r\n)?$/gm.test(content)) {
      return { 'invalidContent': true };
    }
    return { 'invalidContent': false };
  }

  async submit(): Promise<void> {
    try {
      if (this.postForm.valid) {
        await this.postService.createPost(this.postForm.value);
        this.router.navigate(['/posts']);
      }
    } catch (e) {
      console.error('Error creating post', e);
    }
  }
}
