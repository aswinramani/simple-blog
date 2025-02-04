import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service'
import { Router } from '@angular/router';
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {
  posts: any[] = [];
  hasNextPage: boolean = false;
  offset: number = 0;
  limit: number = 20;
  onGoingRequest: boolean = true;
  constructor(
    private readonly postService: PostService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  create(): void {
    this.router.navigate(['/post/new']);
  }

  async loadPosts() {
    this.onGoingRequest = true;
    try {
      const response:any = await this.postService.getPosts(this.offset, this.limit);
      this.posts = [...this.posts, ...response.posts];
      this.hasNextPage = response.hasNextPage;
    } catch (e) {
      console.error('Error fetching posts', e);
    }
    this.onGoingRequest = false;
  }

  loadMore() {
    this.offset += this.limit;
    this.loadPosts();
  }

  navigateToDetail(post:any): void {
    this.postService.setPostDetailData(post);
    this.router.navigate(['/post', post.id]);
  }
}
