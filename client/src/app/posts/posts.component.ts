import { Component, OnInit, ViewChild } from '@angular/core';
import { PostService } from '../services/post.service'
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {
  posts: any[] = [];
  offset: number = 0;
  limit: number = 10;
  onGoingRequest: boolean = true;
  totalPosts: number = 0;
  pageEvent: PageEvent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  itemsPerPage: number = 5;
  constructor(
    private readonly postService: PostService,
    private readonly router: Router
  ) { 
    this.pageEvent = {} as PageEvent;
    this.paginator = {} as MatPaginator;
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  create(): void {
    this.router.navigate(['/post/new']);
  }

  async loadPosts() {
    this.onGoingRequest = true;
    try {
      const posts:any = await this.postService.getPosts(this.offset, this.limit);
      if (!this.posts.length) {
        this.posts = posts;
        if (posts.length === this.limit) {
          const countResp:any = await this.postService.getCount();
          this.totalPosts = countResp['totalCount'];
        } else {
          this.totalPosts = this.posts.length;
        }
      } else {
        this.posts = [...this.posts, ...posts];
      }
    } catch (e) {
      console.error('Error fetching posts', e);
    }
    this.onGoingRequest = false;
  }

  loadMore(event: PageEvent) {
    this.offset = event.pageIndex * event.pageSize;
    this.limit = event.pageSize;
    if (this.posts.length < this.totalPosts) {
      this.loadPosts();
    }
  }

  navigateToDetail(post:any): void {
    this.postService.setPostDetailData(post);
    this.router.navigate(['/post', post.id]);
  }

  get paginatedPosts(): any[] {
    const startIndex = (this.paginator.pageIndex || 0) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.posts.slice(startIndex, endIndex);
  }
}
