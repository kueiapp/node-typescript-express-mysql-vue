<template>
  <div>
    <div class="button-group">
      <button id="refresh-btn" class="btn btn-success" @click="getArticles">Refresh</button>
      <button id="add-btn" class="btn btn-primary" @click="addBtnClicked">Add</button>
      <button id="test-btn" class="btn btn-warning" @click="testBtnClicked">Change Title</button>
    </div>
    <hr/>
    <div class="container">
      <div class="modal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Add your favorite article</h4>
              <button type="button" @click="closeBtnClicked" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            </div>
            <div class="modal-body">
              <form id="form1" class="form-horizontal" role="search">
                <fieldset>
                  <div class="form-group">
                    <label for="inputArticleID" class="col-lg-2 control-label">ArticleID</label>
                    <div class="col-lg-10">
                      <input type="number" class="form-control" name="article_id" placeholder="Article ID">
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="inputEmail" class="col-lg-2 control-label">Email</label>
                    <div class="col-lg-10">
                      <input type="email" class="form-control" name="user_email" placeholder="Email">
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="inputTitle" class="col-lg-2 control-label">Title</label>
                    <div class="col-lg-10">
                      <input type="text" class="form-control" name="title" placeholder="Title">
                    </div>
                  </div>
                  <input class="btn btn-primary" @click="addArticle" value="Submit" />
                  <!-- <button id="sub-btn" class="btn btn-primary" @click="addArticle">Submit</button> -->
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
      <transition name="slide-fade"><!-- only on single element -->
        <ul class="list-group" v-if="articles && articles.length">
          <li v-for="article in articles" :key="article.id" class="list-group-item">
            <div class="list-group-item-text">
              <div class="badge" >{{article.id}}</div>
              <div class="hero-text" @click="selectArticle(article)">
                <div class="name">{{article.user_email}}</div>
                <div class="saying">{{article.title}}</div>
              </div>
            </div>
            <button class="btn btn-danger delete-btn" @click="deleteArticle(article)">Delete</button>
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import $ from 'jquery'
import { UserArticleStruct } from '../UserArticleStruct'
import _ from 'underscore'
import utils from '../utils/utils'
import EventBus from '../utils/EventBus'

// import HeroDetail from './components/HeroDetail.vue';
@Component({
  components: {  }
})
export default class UserList extends Vue 
{
// data
  allArticles:UserArticleStruct[] = [];
  articles:UserArticleStruct[] = [];
  doAdding = false;
  popper = null;

// life-cycle
  created() 
  {
    var self = this;
    EventBus.$on('searched', function(token:string){
      console.log(`got search token = ${token}`)
      const result = self.allArticles.filter( (item:UserArticleStruct) => item.title.includes(token));
      self.articles = result;
      // self.articles = [{"id":"33","title":"xx","user_email":"kk"}]
    })
    EventBus.$on('cancel-searching', function(token)
    {
      // cancel searching
      self.articles = self.allArticles;
    })

    this.getArticles();
  }
// methods
  testBtnClicked() 
  {
    console.log('change to Hello Vue')
    EventBus.$emit('title-changed', 'Hello Vue')
  }

  getArticles() 
  {
    console.log('getArticles.....')
    var self = this;
    fetch("http://localhost:3000/api/article")
      .then( function(res:Response) {
        return res.json()
      })
      .then( function(obj:any) {
        self.articles = obj;
        self.allArticles = obj;
        console.log('articles: ',self.articles)
      })
      .catch( function(err) {
        console.error(err)
      });
  }
  addBtnClicked() 
  {
    console.log("addBtnClicked.....")
    this.doAdding = true;
  }
  closeBtnClicked() 
  {
    this.doAdding = false;
  }
  addArticle() 
  {
    var formData = $('#form1').serialize(); // req.params: a=1&b=2&c=3
    console.log('addArticle in param types: ', formData)
  // native Fetch API
    let aid = $("input[name=article_id]").val() + "" ;
    let title = $("input[name=title]").val() + "";
    let email = $("input[name=user_email]").val() + "" ;
    // checking
      if( aid.length === 0 || title.length === 0 || email.length === 0 ){
        alert("Please type in data in all coloumns.")
      }
      else if( !utils.isEmail(email) || !utils.isNumber(aid) ){
       alert("Please type in with correct types.") 
      }
      else{
        var self = this;    
        fetch('http://localhost:3000/api/article', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "id": aid,
            "title": title,
            "user_email": email
          })
        })
        .then(function(response:Response) {
          return response.json();
        })
        .then(function(res:any) {
          console.log('got response: ',res);
          if(res.code === 200){
            // insert to index zero
            var newdata:UserArticleStruct = res.data;
            self.articles.unshift(newdata)
            self.allArticles.unshift(newdata)
            self.doAdding = false;
          }
        });
      }
    
  }
  selectArticle() 
  {

  }
  deleteArticle(data:UserArticleStruct) 
  {
    console.log("delete: ",data)
    if( confirm('wanna delete it?') ){
      var self = this;
      fetch("http://localhost:3000/api/article",{
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then(function(res:Response)
      {
        return res.json()
      })
      .then(function(res:any)
      {
        console.log(res);
        if(res.code === 200){
          var idx = self.articles.indexOf(data)
          self.articles.splice(idx,1)
        }
        else{
          alert("something wrong in db")
        }
      })
    }
    else{

    }
  }
// watch
  @Watch('doAdding')
  onDoAddingChanged() {
    console.log('onDoAddingChanged...: '+this.doAdding)
    if( this.doAdding ){
      $(".modal").modal("show");
      // $(".modal").css({"background-color":"red"})
    }
    else $(".modal").modal("hide");
  }
}

</script>

<style lang="scss" scoped>

.slide-fade-enter-active {
  transition: all 1.3s ease;
}
.slide-fade-leave-active {
  transition: all 1.8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.delete-btn{
  position: relative;
  top: 5px;
  right: 15px;
}
</style>
