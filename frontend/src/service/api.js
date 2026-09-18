const BaseUrl = "http://localhost:3000/api/";

export const login = BaseUrl + "auth/login";
export const signup = BaseUrl + "auth/signup";
export const getAllPosts = BaseUrl + "post/getPost";
export const mypost = BaseUrl + "post/getPost";
export const createPost = BaseUrl + "post/createPost";
export const getAllCategories = BaseUrl + "category/allCategory";
export const createCategory = BaseUrl + "category/postcategory";

export const likePost = (postId) => `${BaseUrl}post/like/${postId}`;

export const unlikePost = (postId) => `${BaseUrl}post/unlike/${postId}`;

export const commentPost = (postId) => `${BaseUrl}post/comment/${postId}`;

export const deletePost = (postId) => `${BaseUrl}post/deletepost/${postId}`;
