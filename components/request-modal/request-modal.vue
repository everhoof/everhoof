<template>
  <!-- begin .request-modal-->
  <div class="request-modal">
    <div style="">
      <div class="controls" style="text-align: center; margin-left: auto; margin-right: auto; max-width: 1090px">
        <div style="text-align: center; margin-left: auto; margin-right: auto; max-width: 1090px">
          <input
            class="textbox"
            type="text"
            value="search"
            size="50"
            @change="getSongs"
            @keyup="getSongs_t"
            v-model="search"
          />
        </div>
        <div hidden>
          <span>Results per page</span>
          <input type="text" value="10" size="3" @change="getSongs" v-model="amount" />
        </div>
      </div>
      <div v-if="reqdt.total > 0">
        <div class="songs list">
          <div v-for="(entry, index) in reqdt.rows" :key="index" class="row">
            <div class="cell1" style="width: 20%">{{ entry.song_artist }}</div>
            <div class="cellsep" style="width: 10px"></div>
            <div class="cell2" style="width: 40%">{{ entry.song_title }}</div>
            <div class="cellsep" style="width: 10px"></div>
            <div class="cell3" style="width: 20%">{{ entry.song_album }}</div>
            <div class="cellsep" style="width: 10px"></div>
            <div class="cell4">
              <a
                href="#"
                role="button"
                @click.prevent="
                  sendReq(entry.request_id);
                  search = '';
                  search_l = 0;
                  getSongs();
                "
              >
                <img src="@/assets/icons/req.svg" aria-hidden="true" height="26px" style="display: flex" />
              </a>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-left: auto; margin-right: auto; max-width: 1090px; display: inline-flex">
          <a href="#" role="button" @click.prevent="page_l()">
            <img src="@/assets/icons/left-arrow.svg" aria-hidden="true" height="50px" style="display: flex" />
          </a>
          <input class="textbox" type="text" value="10" size="2" @change="getSongs" v-model="page" />
          <!--
          <span class="textbox" style="padding:10px 10px 10px 0px">
            / {{ Math.round(reqdt.total / amount + 0.4) }}</span
          >-->
          <a href="#" role="button" @click.prevent="page_r()">
            <img src="@/assets/icons/right-arrow.svg" aria-hidden="true" height="50px" style="display: flex" />
          </a>
        </div>
      </div>
      <div v-else style="text-align: center; margin-left: auto; margin-right: auto; max-width: 1090px">
        <br />
        <br />
        <div v-if="search_l >= 3">У нас такого нету :c</div>
        <div v-else>Начните вводить название песни</div>
        <br />
        <br />
      </div>
    </div>
  </div>
  <!-- end .request-modal-->
</template>
<style scoped>
.cell1,
.cell2,
.cell3,
.cell4 {
  min-height: 50px;
  align-items: center;
  text-align: center;
  align-content: center;
  display: flex;
  justify-content: center;
  vertical-align: bottom;
  background-color: #3d3d3d;
}
.cell1 {
  min-width: 100px;
  max-width: 190px;
}
.cell2 {
  min-width: 100px;
  max-width: 570px;
  flex-wrap: wrap;
  flex-grow: 1;
}
.cell3 {
  min-width: 100px;
  max-width: 230px;
}
.cell4 {
  min-width: 50px;
  max-width: 50px;
}

.cellsep {
  flex-shrink: 0;
  min-height: 50px;
  background-color: #272727;
}
.row {
  max-width: 1090px;
  margin: 10px;
  padding: 0 4px;
  margin-left: auto;
  margin-right: auto;
  display: inline-flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  align-content: center;
  display: flex;
  justify-content: center;
  vertical-align: bottom;
}
</style>
<style scoped>
.controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.pagecontrols {
  display: flex;
  flex-wrap: wrap;
  justify-content: right;
}
</style>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Vue } from 'nuxt-property-decorator';

import axios from 'axios';

@Component({
  name: 'b-request-modal',
})
export default class RequestModal extends Vue {
  hpt = '';
  search = '';
  page = '1';
  amount = '20';
  search_l = 0;
  reqdt = {
    current: 1,
    rowCount: 0,
    total: 0,
  };
  getSongs_t_timer = 0;
  page_r() {
    if (Math.round(this.reqdt.total / +this.amount + 0.4) > +this.page) {
      this.page = `${+this.page + 1}`;
      this.getSongs();
    }
  }
  page_l() {
    if (+this.page - 1 > 0) {
      this.page = `${+this.page - 1}`;
      this.getSongs();
    }
  }

  async sendReq(req: any) {
    await axios.get('http://bar-everypony.ru/api_c/proxy/request.php?req=' + req);
    // eslint-disable-next-line no-undef
  }
  getSongs_t() {
    window.clearTimeout(this.getSongs_t_timer);
    this.$nextTick(() => {
      this.getSongs_t_timer = window.setTimeout(this.getSongs, 500);
    });
  }
  async getSongs() {
    clearTimeout(this.getSongs_t_timer);
    this.search_l = this.search.length;
    if (this.search.length < 3) {
      this.reqdt.total = 0;
      // eslint-disable-next-line no-undef
      alert('Введите как минимум 3 символа для поиска');
      return;
    } else if (this.search.length > 60) {
      this.reqdt.total = 0;
      alert('Слишком многа букааф');
      return;
    }

    await axios
      .get(
        'http://bar-everypony.ru/api_c/proxy/search.php?current=' +
          this.page +
          '&rowCount=' +
          this.amount +
          '&searchPhrase=' +
          this.search,
      )
      .then((resp) => {
        this.reqdt = resp.data;

        let pggga = Math.round(this.reqdt.total / +this.amount + 0.4);
        if (pggga === 0) {
          pggga = 1;
        }
        if (pggga < +this.page) {
          this.page = '1';
          this.getSongs();
        }
      })
      .catch(() => {
        // eslint-disable-next-line no-undef
        alert('Произошла ошибка');
      });
    // eslint-disable-next-line no-undef
  }
  created() {}
  onbtclick() {
    alert(this.hpt);
  }
}
</script>

<style lang="stylus" src="./request-modal.styl" />
