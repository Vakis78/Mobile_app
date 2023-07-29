import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

@Injectable() export class AppStorage {
    
    public static STORE_POSTS="posts";
    public static STORE_MYPOSTS="myposts";
    public static STORE_FAVORITES="favorites";
    public static STORE_LIKES="likes";

    constructor(private storage: Storage){
    }

    public async clearStore(storeName: string){
        return this.storage.set(storeName,null);
    }

    public clearAll(){
        this.storage.clear();
        //this.clearStore(AppStorage.STORE_POSTS);
        //this.clearStore(AppStorage.STORE_FAVORITES);
        //this.clearStore(AppStorage.STORE_LIKES);
    }

    public getStoreNameFromMode(mode: string){
        switch(mode){
            case "favorites":
                return AppStorage.STORE_FAVORITES;
            case "posts":
            case "related":
                return AppStorage.STORE_POSTS;
            case "myposts":
                return AppStorage.STORE_MYPOSTS;
            default:
                return AppStorage.STORE_POSTS;
        }
    }

    public async getStore(storeName){
        return this.storage.get(storeName);
    }

    public async setStore(storeName,value){
        return this.storage.set(storeName,value);
    }

    public async getArrayStore(storeName){
        return new Promise<any>((resolve,reject)=>{
            this.getStore(storeName).then((value)=>{
                if (value==null)
                    value=[];
                resolve(value);
            },(err)=>{
                reject(err);
            })
        });
    }

    public async addPostToStore(storeName,post){
        return new Promise<any>((resolve,reject)=>{
            this.getArrayStore(storeName).then((posts)=>{
                posts.push(post);
                this.setStore(storeName,posts);
                resolve(posts);
            });
        });
    }

    public async removePostFromStore(storeName,post){
        return new Promise<any>((resolve,reject)=>{
            this.getArrayStore(storeName).then((posts)=>{
                for (let a=0;a<posts.length;a++){
                    if (posts[a].id==post.id){
                        posts.splice(a,1);
                        break;
                    }
                }
                this.setStore(storeName,posts);
                resolve(posts);
            });
        });
    }

    public async updatePostInStore(storeName,post){
        return new Promise<any>((resolve,reject)=>{
            this.getArrayStore(storeName).then((posts)=>{
                let updated=false;
                for (let a=0;a<posts.length;a++){
                    if (posts[a].id==post.id){
                        posts[a]=post;
                        updated=true;
                        break;
                    }
                }
                this.setStore(storeName,posts);
                resolve(updated);
            });
        });
    }

    public async updatePost(post){
        await this.updatePostInStore(AppStorage.STORE_POSTS,post);
        await this.updatePostInStore(AppStorage.STORE_FAVORITES,post);
        await this.updatePostInStore(AppStorage.STORE_MYPOSTS,post);
    }

    public async postInStore(storeName,post){
        return new Promise<boolean>((resolve,reject)=>{
            this.getArrayStore(storeName).then((posts)=>{
                for (let a=0;a<posts.length;a++){
                    if (posts[a].id==post.id){
                        resolve(true);
                        return;
                    }
                }
                resolve(false);
            },(err)=>{
                reject(err);
            })
        });
    }

    public async togglePost(storeName,post){
        return new Promise<boolean>((resolve,reject)=>{
            this.postInStore(storeName,post).then((inStore)=>{
                if (inStore)
                    this.removePostFromStore(storeName,post);
                else
                    this.addPostToStore(storeName,post);
                resolve(!inStore);
            });
        });
    }

    public async setPosts(posts){
        return this.setStore(AppStorage.STORE_POSTS,posts);
    }

    public async getPosts(){
        return this.getArrayStore(AppStorage.STORE_POSTS);
    }

    public async getFavorites(){
        return this.getArrayStore(AppStorage.STORE_FAVORITES);
    }

    public async setFavorites(posts){
        return this.setStore(AppStorage.STORE_FAVORITES,posts);
    }

    public async checkFavorite(post){
        return this.postInStore(AppStorage.STORE_FAVORITES,post);
    }

    public async addToFavorites(post){
        return new Promise<any>((resolve,reject)=>{
            this.addPostToStore(AppStorage.STORE_FAVORITES,post).then((posts)=>{
                resolve(posts);
            });
        });
    }

    public async removeFromFavorites(post){
        return new Promise<any>((resolve,reject)=>{
            this.removePostFromStore(AppStorage.STORE_FAVORITES,post).then((posts)=>{
                resolve(posts);
            });
        });
    }

    public async toggleFavorite(post){
        return this.togglePost(AppStorage.STORE_FAVORITES,post);
    }

    public async getLikes(){
        return this.getArrayStore(AppStorage.STORE_LIKES);
    }

    public async setLikes(posts){
        return this.setStore(AppStorage.STORE_LIKES,posts);
    }

    public async checkLiked(post){
        return this.postInStore(AppStorage.STORE_LIKES,post);
    }

    public async addToLikes(post){
        return new Promise<any>((resolve,reject)=>{
            this.addPostToStore(AppStorage.STORE_LIKES,post).then((posts)=>{
                resolve(posts);
            });
        });
    }

    public async removeFromLikes(post){
        return new Promise<any>((resolve,reject)=>{
            this.removePostFromStore(AppStorage.STORE_LIKES,post).then((posts)=>{
                resolve(posts);
            });
        });
    }

    public async toggleLike(post){
        return this.togglePost(AppStorage.STORE_LIKES,post);
    }
}