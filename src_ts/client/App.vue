<template>
  <div id="app">
    <div id="test"></div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <a class="navbar-brand" href="#">{{title}}</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarColor01">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
          </li>
        </ul>
        <form id="search-form" class="form-inline my-2 my-lg-0">          
          <a href="#" class="btn btn-warning" @click="cancelBtnClicked" v-if="isSearching">X</a>
          <input class="form-control mr-sm-2" type="text" placeholder="Search">
          <button @click="searchBtnClicked" class="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
        </form>
      </div>
    </nav>

    <UserList></UserList>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import UserList from './components/UserList.vue';
import EventBus from './utils/EventBus'
import $ from 'jquery'

@Component({
  components: { UserList }
})
export default class App extends Vue 
{
// data-toggle
  title: string;
  isSearching: boolean = false

  constructor() 
  {
    super();
    this.title = 'Vue App';
  }
// life-cycle
  created() 
  {
    var self = this;
    EventBus.$on('title-changed', function(newtitle){
      console.log('got Hello Vue: '+newtitle)
      self.title = newtitle;
    })
  }
// methods
  searchBtnClicked() 
  {
    var self = this;
    $("#search-form").submit(function(e)
    {
      e.preventDefault()
      var token:string = $("#search-form input").val() + ""
      EventBus.$emit('searched', token);
      self.isSearching = true;
    })
  }
  cancelBtnClicked()
  {
    this.isSearching = false;
    $("#search-form input").val("")
    EventBus.$emit('cancel-searching', true);
  }
}
</script>

<style lang="css">
button {
  color: #eee;
  font-family: Arial;
  font-size: 14px;
  background-color: #000;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  width: 100px;
}
body {
  margin: 2em;
}
div {
  margin: 0.1em;
}
.header-bar {
  background-color: rgb(100, 120, 215);
  height: 4px;
  margin-top: 10px;
  margin-bottom: 10px;
}
label {
  display: inline-block;
  width: 4em;
  margin: 0.5em 0;
  color: #888;
}
input {
  height: 2em;
  font-size: 1em;
  padding-left: 0.4em;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
