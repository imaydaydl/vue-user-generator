function rand(min, max){
  return Math.round(Math.random() * (max - min) + min);
}

function* userGenerator(){
  let names = ['Liam','Noah','Mason','Ethan','Logan','Emma','Olivia','Ava','Sophia','Isabella'];
  let surnames = ['Smith','Johnson','Williams','Jones','Brown','Davis','Miller','Wilson','Moore','Taylor'];

  while (true) {
    let name = names[rand(0, names.length - 1)];
    let surname = surnames[rand(0, surnames.length - 1)];
    let status = Math.random() > 0.5;
    let user = {name, surname, status}
    yield user;
  }
}

function langGen(texts) {
  $('.lng').each(function() {
    let k = $(this).data('dbtext');
    $(this).html(texts[k]);
  });
}

Vue.component('users-list', {
  template: `
    <ul class="list_user">
      <li class="userblock">
        <div class="first_cell">{{ langs['tab_id'] }}</div>
        <div class="second_cell">{{ langs['tab_name'] }}</div>
        <div class="third_cell">{{ langs['tab_status'] }}</div>
        <div class="fourth_cell">{{ langs['tab_menu'] }}</div>
      </li>
      <li class="userblock" v-for="user in users">
        <div class="first_cell">{{ user.id }}</div>
        <div class="second_cell">{{ user.name }} {{ user.surname }}</div>
        <div class="third_cell">{{ user.status == true ? langs['user_active'] : langs['user_block'] }}</div>
        <div class="fourth_cell">
          <button class="btn page_button" @click="() => $emit('edit', user)" :title="langs['edit']"><i class="fas fa-user-edit"></i></button>

          <button class="btn btn-danger" v-if="user.status" @click="$emit('block', user)" :title="langs['block']"><i class="fas fa-user-lock"></i></button>
          <button class="btn btn-success" v-else @click="$emit('unblock', user)" :title="langs['unblock']"><i class="fas fa-user-check"></i></button>
        </div>
      </li>
    </ul>
  `,
  props: {
    'users': {
      type: Array,
      required: true,
    },
    'langs': {
      type: Object,
      required: true
    }
  }
});

Vue.component('counter-button', {
  template: `<div id="subbut">
    <span v-if="loading" id="loadingimg">
      <div class="spinner-border text-info" role="status">
        <span class="visually-hidden"></span>
      </div>
    </span>
    <button class="page_button page_button_pad" v-else id="subbutton" v-on:click="$emit('click')"><i class="fas fa-user-friends"></i> {{ langs['need_more'] }}</button>
  </div>`,
  props: {
    'loading': {
      type: Boolean,
      required: false,
      default: false,
    },
    'langs': {
      type: Object,
      required: true
    }
  }
});

Vue.component('addus-form', {
  template: `
  <div class="add_form">
    <form @submit.prevent="addNewUser" class="formadd" id="formadd">
      <span v-if="loading" id="loadingimg">
        <div class="spinner-border text-info" role="status">
          <span class="visually-hidden"></span>
        </div>
      </span>
      <div v-else>
        <div class="input-group content-center">
          <span class="input-group-text">{{ langs['add_user_form'] }}</span>
          <input v-model="newName" class="form-control" id="newuser" :disabled="disabled" :placeholder="langs['name_example']">
          <input v-model="newSurname" class="form-control" id="newuser" :disabled="disabled" :placeholder="langs['surname_example']">
          <button type="button" class="btn page_button" @click="saveEditing" v-if="editUser"><i class="fas fa-save"></i> <span>{{ langs['save'] }}</span></button>
          <button type="submit" class="btn page_button" v-else :disabled="disabled || !isValid" ><i class="fas fa-user-plus"></i> {{ langs['add'] }}</button>
          <button type="reset" class="btn page_button" v-if="editUser" @click="() => $emit('cancel-editing-user')"><i class="fas fa-times"></i> {{ langs['cancel'] }}</button>
        </div>
      </div>
    </form>
  </div>
  `,
  props: {
    'loading': {
      type: Boolean,
      required: false,
      default: false,
    },
    'disabled': {
      type: Boolean,
      required: false,
      default: false,
    },
    'user':{
      type: Object,
      required: false,
      default: null,
    },
    'langs': {
      type: Object,
      required: true
    }
  },
  data(){
    return{
      newName: '',
      newSurname: '',
    }
  },
  methods:{
    addNewUser(){
      let nname = this.newName;
      let sname = this.newSurname;
      this.$emit('submit', {nname, sname});
    },
    clearForm(){
      this.newName = '';
      this.newSurname = '';
    },
    saveEditing() {
      let first = this.newName;
      let second = this.newSurname;
      this.$emit('save-editing-user', {first, second});
    }
  },
  computed:{
    isValid(){
      return this.newName.trim().length && this.newSurname.trim().length;
    },
    editUser(){
      return this.user != null;
    }
  },
  watch:{
    user(){
      if(this.editUser){
        this.newName = this.user.name;
        this.newSurname = this.user.surname;
      } else {
        this.newName = '';
        this.newSurname = '';
      }
    }
  }
});

root = new Vue({
  el: '#todo-list-example',
  data: {
    users: [],
    status: -1,
    counter: 0,
    userGenerator : null,
    generatingNewUsers: false,
    addingNewUser: false,
    increment: 1,
    test: false,
    editingUser: null,
    langs: {
      ua: {
        title: 'Генерація списку користувачів',
        all: 'Всі',
        active: 'Активні',
        blocked: 'Заблоковані',
        darktheme: 'Темна тема',
        lighttheme: 'Світла тема',
        tab_id: 'ID',
        tab_name: 'Користувач',
        tab_status: 'Статус',
        tab_menu: 'Меню дій',
        need_more: 'Потрібно більше користувачів',
        edit: 'Редагувати',
        add_user_form: 'Додати користувача',
        block: 'Заблокувати',
        unblock: 'Розблокувати',
        user_active: 'Активний',
        user_block: 'Заблокований',
        name_example: 'Ім\'я. Наприклад, Pitter',
        surname_example: 'Прізвище. Наприклад, Riddley',
        save: 'Зберегти',
        add: 'Додати',
        cancel: 'Відміна'
      },
      en: {
        title: 'User list generation',
        all: 'All',
        active: 'Active',
        blocked: 'Blocked',
        darktheme: 'Dark theme',
        lighttheme: 'Light theme',
        tab_id: 'ID',
        tab_name: 'User',
        tab_status: 'Status',
        tab_menu: 'Menu',
        need_more: 'Need more users',
        edit: 'Edit',
        add_user_form: 'Add user',
        block: 'Block',
        unblock: 'Unblock',
        user_active: 'Active',
        user_block: 'Blocked',
        name_example: 'Name. For example, Pitter',
        surname_example: 'Surname. For example, Riddley',
        save: 'Save',
        add: 'Add',
        cancel: 'Cancel'
      }
    },
    lang: 'ua',
    darkTheme: localStorage.getItem('darkTheme') == 'true' ? true : false
  },
  created(){
    if(this.darkTheme == true) {
      document.body.classList.add('dark_theme');
    }
    this.userGenerator = userGenerator();
    langGen(this.langs[this.lang]);
  },
  mounted(){
    this.makeNewUsers();
  },
  methods: {
    makeUsers(qty){
      const newUsers = [];
        
      for (let i = 0; i < qty; i++) {
        let newUser = this.userGenerator.next().value;
        newUser.id = this.increment;
        this.increment++;
        newUsers.push(newUser);
      }
        
      return newUsers;
    },
    makeNewUsers(){
      this.generatingNewUsers = true;
      var prom = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve( this.makeUsers(rand(5, 10)));
        }, Math.random() * 2000 + 1000);
      })
      .then((users) => {
        this.users = this.users.concat(users);
        this.generatingNewUsers = false;
      });
    },
    block(user){
      user.status = false;
    },
    unblock(user){
      user.status = true;
    },
    addGNewUser({ nname, sname}){
      let nameus = nname;
      let surus = sname;
      let addnewus = this.users.push({
        name: nameus,
        surname: surus,
        id: this.increment,
        status: true
      });
      this.addingNewUser = true;
      this.test = true;
      var prom2 = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, Math.random() * 2000 + 1000);
      })
      .then(() => {
        this.increment++;
        this.$refs.addusForm.clearForm();
        this.addingNewUser = false;
        this.test = false;
      });
    },
    edituser(user){
      this.editingUser = user;
      document.getElementById("formadd").scrollIntoView();
    },
    cancelEditingUser(){
      this.editingUser = null;
    },
    saveEditingUser({ first, second}) {
      for( const i in this.users ) {
        if(this.users[i].id == this.editingUser.id) {
          this.users[i].name = first;
          this.users[i].surname = second;
        }
      }
      this.editingUser = null;
    },
    changeTheme() {
      this.darkTheme = !this.darkTheme;
      if(this.darkTheme == true) {
        document.body.classList.add('dark_theme');
      } else {
        document.body.classList.remove('dark_theme');
      }
      localStorage.setItem('darkTheme', this.darkTheme);
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => this.status == -1 ? true : user.status == this.status);
    }
  },
  watch: {
    lang() {
      langGen(this.langs[this.lang]);
    }
  }
})