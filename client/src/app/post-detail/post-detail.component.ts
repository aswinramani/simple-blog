import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PostResponse } from '../interfaces/PostResponse';
import { Post } from '../interfaces/Post';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent implements OnInit {
  post: Post | undefined;
  onGoingRequest: boolean = true
  constructor(
    private readonly postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadPostDetail();
  }

  loadPostDetail(): void {
    this.onGoingRequest = true;
    let post: Post | undefined = this.postService.getPostDetailData();
    if (!post) {
      this.route.params.subscribe( async(params: Params) => {
        let response: PostResponse = await this.postService.getPostById(params["postId"]);
        if (!response["data"]) {
          this.router.navigate(['/posts']);
        }
        this.post = response["data"];
        this.onGoingRequest =  false;
      });
    } else {
      this.post = post;
      this.onGoingRequest = false
    }
  }
}
