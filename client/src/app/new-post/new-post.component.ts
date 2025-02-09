import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../services/post.service';
import { Router } from '@angular/router';
import { PostForm } from '../interfaces/PostForm';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent {
  postForm?: FormGroup<PostForm>;

  constructor(
    private fb: FormBuilder,
    private readonly postService: PostService, 
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(75)]],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(350)]],
    });
  }

  async submit(): Promise<void> {
    try {
      if (this.postForm?.valid) {
        await this.postService.createPost(this.postForm.value);
        this.router.navigate(['/posts']);
      }
    } catch (e) {
      console.error('Error creating post', e);
    }
  }
}
