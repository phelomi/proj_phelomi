<template>
  <div class="order-list">
    <v-layout row wrap justify-end>
      <v-btn @click="methodBackTest">
        <v-icon>mdi-plus</v-icon>
        測試訂單
      </v-btn>
    </v-layout>
    <v-expansion-panel class="mb-2">
      <v-expansion-panel-content class="accent">
        <div slot="header" class="subheading">搜尋選項</div>
        <v-form v-model="valid" class="px-2">
          <v-layout row wrap>
            <v-flex
              sm12
              md4
              lg3
              px-1
              v-for="(item, idx) in searchItemParams"
              :key="`searchItemParams${idx}`"
            >
              <v-text-field
                v-model="searchParams[item.key]"
                :label="item.label"
                clearable
              ></v-text-field>
            </v-flex>
            <!-- <v-flex sm12 md4 lg3 px-1 >
              <v-select
                v-model="searchParams.roomType"
                :items="constList.roomTypeList"
                item-text="value"
                item-value="id"
                label="訂房房型"
              ></v-select>
            </v-flex> -->
            <v-flex sm12 md4 lg3 px-1 >
              <v-select
                v-model="searchParams.status"
                :items="constList.orderStatusList"
                item-text="value"
                item-value="id"
                label="訂單狀態"
              ></v-select>
            </v-flex>
            <v-flex
              sm12
              md4
              lg3
              px-1
              v-for="(item, idx) in searchSwitchParams"
              :key="`searchSwitch${idx}`"
            >
              <v-switch
                class="justify-center"
                color="primary"
                v-model="searchParams[item.key]"
                :label="item.label"
              ></v-switch>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex
              sm12
              md3
              lg3
              px-1
              v-for="(item, idx) in searchTimeParams"
              :key="`searchTimeParams${idx}`"
            >
              <v-menu
                :ref="`menu${idx}`"
                :close-on-content-click="false"
                v-model="selectMenu[idx]"
                :nudge-right="40"
                :value="searchParams[item.key]"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                :disabled="searchParams.outOfTimeSignShow || searchParams.timeOutSignShow"
              >
                <v-text-field
                  slot="activator"
                  v-model="searchParams[item.key]"
                  :label="item.label"
                  clearable
                  prepend-icon="mdi-calendar"
                  readonly
                  :disabled="searchParams.outOfTimeSignShow || searchParams.timeOutSignShow"
                ></v-text-field>
                <v-date-picker
                  v-model="searchParams[item.key]"
                  scrollable
                  no-title
                  locale="zh-Hant"
                  show-current
                  class="d-flex"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    flat
                    color="primary"
                    @click="$set(selectMenu,idx,false)"
                  >Cancel</v-btn>
                  <v-btn
                    flat
                    color="primary"
                    @click="$refs[`menu${idx}`][0].save(searchParams[item.key])"
                  >OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex text-xs-right>
              <v-btn flat @click="methodFormReset">重置</v-btn>
              <v-btn color="primary" @click="methodProcessParams">
                <v-icon>mdi-magnify</v-icon>搜尋
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-card>
      <v-card-title>
        訂單資訊
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="搜尋結果篩選"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="orderList"
        :search="search"
        prev-icon="mdi-menu-left"
        next-icon="mdi-menu-right"
        sort-icon="mdi-menu-down"
        rows-per-page-text="每頁顯示筆數"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        expand
        item-key="orderId"
      >
        <template slot="items" slot-scope="props">
          <tr
            @click="props.expanded = !props.expanded"
            :class="[
              props.item.outOfTimeSign ? 'amber accent-1' : '',
              props.item.timeOutSign ? 'red accent-1' : ''
            ]"
          >
            <td class="text-xs-center">{{ props.item.orderId }}</td>
            <td class="text-xs-center">{{ props.item.name }}</td>
            <!-- <td class="text-xs-center">{{ props.item.gender }}</td> -->
            <td class="text-xs-center">{{ props.item.phone }}</td>
            <!-- <td class="text-xs-center">{{ props.item.nationality }}</td> -->
            <!-- <td class="text-xs-center">{{ props.item.numberAdult }}</td>
            <td class="text-xs-center">{{ props.item.numberChild }}</td> -->
            <!-- <td class="text-xs-center">{{ dateTime(props.item.checkInTime) }}</td> -->
            <!-- <td class="text-xs-center">{{ dateTime(props.item.checkOutTime) }}</td> -->
            <!-- <td class="text-xs-center">{{ dateTime(props.item.createTime) }}</td> -->
            <!-- <td class="text-xs-center">{{ formatRoomType(props.item.roomType) }}</td> -->
            <!-- <td class="text-xs-right">{{ currencies(props.item.price) }}</td> -->
            <td class="text-xs-right">{{ currencies(props.item.totalDeposit) }}</td>
            <td class="text-xs-right">{{ currencies(props.item.totalValidDeposit) }}</td>
            <td class="text-xs-right">{{ currencies(props.item.totalPrice) }}</td>
            <td class="text-xs-right">{{ currencies(props.item.totalValidPrice) }}</td>
            <td class="text-xs-right">{{ currencies(props.item.totalRefund) }}</td>
            <td class="text-xs-right">{{ currencies(props.item.totalValidRefund) }}</td>
            <td class="text-xs-center">
              <div v-if="[5, 7, 8].includes(props.item.status)">
                {{ formatOrderStatus(props.item.status) }}
              </div>
              <template v-else>
                <v-btn
                  small
                  @click.stop="methodUpdateStatus(props.item)"
                >{{ formatOrderStatus(props.item.status) }}</v-btn>
                <v-btn small @click.stop="methodUpdateOrder(props.item)">
                  <v-icon>mdi-square-edit-outline</v-icon>修改訂單
                </v-btn>
              </template>
            </td>
            <!-- <td class="text-xs-center">{{ props.item.latestModifyAccount }}</td> -->
            <!-- <td class="text-xs-center">
            </td> -->
            <!-- <td class="text-xs-center">{{ dateTime(props.item.latestModifyTime) }}</td> -->
            <!-- <td class="text-xs-center">{{ props.item.note }}</td> -->
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <div class="order-list__detail-list pa-3 pl-5 accent">
            <v-layout row wrap>
              <v-flex xs12>
                <p>訂單訊息</p>
              </v-flex>
              <v-flex xs12 class="order-list__detail-list--content">
                <table class="order-list__detail-table">
                  <tr v-for="(key,keyIdx) in ['text', 'value']" :key="`detailRow${keyIdx}`">
                    <td
                      v-for="(item,idx) in detailHeaders"
                      :key="`detailItem${idx}`"
                    >{{keyIdx === 0
                      ? item[key]
                      : methodDetailTableFormat(props.item[item[key]], item.format) }}</td>
                  </tr>
                </table>
              </v-flex>
            </v-layout>
            <v-divider class="my-3"></v-divider>
            <v-layout row wrap>
              <v-flex xs12>
                <p>訂房資訊</p>
              </v-flex>
              <v-flex xs12 class="order-list__detail-list--content">
                <order-rooms
                  :orderRoomList="props.item.roomInfo"
                />
              </v-flex>
            </v-layout>
          </div>
        </template>
        <v-alert slot="no-results" :value="true" color="warning" icon="mdi-alert">
          找不到有關於 "{{ search }}" 的資料
        </v-alert>
        <template slot="no-data">
          <v-alert :value="true" color="primary" icon="mdi-alert">
            暫無數據
          </v-alert>
        </template>
        <template slot="pageText" slot-scope="props">
          第{{ props.pageStart }}筆 - 第{{ props.pageStop }}筆，總筆數 {{ props.itemsLength }}
        </template>
      </v-data-table>
    </v-card>
    <dialogComponent
      :openDialog="confirmDialogInfo.openDialog"
      @valueChange="methodChangeOpenDialog"
      :title="confirmDialogInfo.title"
      :contentFilePath="confirmDialogInfo.contentFilePath"
      :contentData="confirmDialogInfo.contentData"
      :confirmMethod="confirmDialogInfo.confirmMethod"
      :otherMethod="confirmDialogInfo.otherMethod"
      :width="confirmDialogInfo.width"
    />
  </div>
</template>
<script>
import httpMethod from '@/utils/httpMethod';
import constList from '@/utils/const';
import dialogComponent from '@/views/layout/components/dialog.vue';
import orderRooms from './orderRooms.vue';
import { dateTime, currencies, formatStringDate } from '@/utils/calculation';

export default {
  name: 'orderList',
  components: {
    dialogComponent,
    orderRooms,
  },
  data() {
    return {
      constList,
      search: '',
      rowsPerPageItems: [20, 30, 50, 80, 100],
      pagination: {
        rowsPerPage: 20,
      },
      headers: [
        { text: '訂單編號', value: 'orderId', sortable: false },
        { text: '姓名', value: 'name', sortable: false },
        // { text: '性別', value: 'gender', sortable: false },
        { text: '電話', value: 'phone', sortable: false },
        // { text: '電子郵件', value: 'email', sortable: false },
        // { text: '成人人數', value: 'numberAdult', sortable: false },
        // { text: '小孩人數', value: 'numberChild', sortable: false },
        // { text: '入住時間', value: 'checkInTime', sortable: false },
        // { text: '退房時間', value: 'checkOutTime', sortable: false },
        // { text: '訂房時間', value: 'createTime', sortable: false },
        // { text: '訂房房型', value: 'roomType', sortable: false },
        // { text: '房間單價', value: 'price', sortable: false },
        { text: '應收總訂金', value: 'totalDeposit', sortable: false },
        { text: '實收總訂金', value: 'totalValidDeposit', sortable: false },
        { text: '應收總價', value: 'totalPrice', sortable: false },
        { text: '實收總價', value: 'totalValidPrice', sortable: false },
        { text: '應退金額', value: 'totalRefund', sortable: false },
        { text: '實退金額', value: 'totalValidRefund', sortable: false },
        { text: '訂單狀態', value: 'status', sortable: false },
        // { text: '最近操作訂單帳號', value: 'latestModifyAccount', sortable: false },
        // { text: '操作', value: '', sortable: false },
        // { text: '最近操作訂單時間', value: 'latestModifyTime', sortable: false },
        // { text: '備註', value: 'note', sortable: false },
      ],
      detailHeaders: [
        { text: '訂房時間', value: 'createTime', format: 'time' },
        { text: '電子郵件', value: 'email', format: null },
        { text: '成人人數', value: 'numberAdult', format: null },
        { text: '小孩人數', value: 'numberChild', format: null },
        { text: '早餐', value: 'breakfast', format: null },
        { text: '其他需求', value: 'demand', format: 'string' },
        { text: '備註', value: 'note', format: null },
        { text: '預計抵達時間', value: 'arriveTime', format: null },
        { text: '最近操作訂單帳號', value: 'latestModifyAccount', format: null },
      ],
      orderList: [],
      valid: false,
      searchParams: this.getParamsOrigin(),
      searchItemParams: [
        { label: '訂單編號', key: 'orderIdShow' },
        { label: '姓名', key: 'nameShow' },
        { label: '電話', key: 'phoneShow' },
        { label: '早餐', key: 'breakfastShow' },
        // { label: '電子郵件', key: 'emailShow' },
        { label: '國籍', key: 'nationalityShow' },
        // { label: '最近操作訂單帳號', key: 'latestModifyAccountShow' },
        // { label: '備註', key: 'noteShow' },
      ],
      searchTimeParams: [
        // { label: '入住開始時間', key: 'checkInTimeStartShow' },
        // { label: '入住結束時間', key: 'checkInTimeEndShow' },
        // { label: '退房開始時間', key: 'checkOutTimeStartShow' },
        // { label: '退房結束時間', key: 'checkOutTimeEndShow' },
        { label: '訂房開始時間', key: 'createStartTimeShow' },
        { label: '訂房結束時間', key: 'createEndTimeShow' },
        // { label: '最近操作訂單開始時間', key: 'latestModifyTimeStartShow' },
        // { label: '最近操作訂單結束時間', key: 'latestModifyTimeEndShow' },
      ],
      searchSwitchParams: [
        { label: '即將逾時訂單', key: 'outOfTimeSignShow' },
        { label: '已逾時訂單', key: 'timeOutSignShow' },
      ],
      selectMenu: [false, false, false, false, false, false, false, false],
      confirmDialogInfo: {
        openDialog: false,
        title: '',
        contentFilePath: 'pages/order/addOrder.vue',
        contentData: null,
        confirmMethod: null,
        otherMethod: null,
      },
      roomTypeList: null,
    };
  },
  watch: {
    'searchParams.outOfTimeSignShow': {
      handler(val) {
        if (val) {
          this.searchParams.timeOutSignShow = false;
        }
      },
    },
    'searchParams.timeOutSignShow': {
      handler(val) {
        if (val) {
          this.searchParams.outOfTimeSignShow = false;
        }
      },
    },
  },
  mounted() {
    this.getOrder();
    this.getRoomOptions();
  },
  methods: {
    dateTime,
    currencies,
    formatStringDate,
    formatRoomType(type) {
      const res = this.roomTypeList.filter(item => item.cid === type)[0];
      return res ? res.name : '';
    },
    async getRoomOptions() {
      const res = await httpMethod({
        url: '/v1/api/room/options',
        method: 'GET',
      });
      this.roomTypeList = res.data;
    },
    formatOrderStatus(type) {
      const res = constList.orderStatusList.filter(item => item.id === type)[0];
      return res ? res.value : '';
    },
    getParamsOrigin() {
      return {
        // roomType: null,
        status: null,
        orderIdShow: null,
        nameShow: null,
        phoneShow: null,
        breakfastShow: null,
        // emailShow: null,
        nationalityShow: null,
        // latestModifyAccountShow: null,
        // noteShow: null,
        // checkInTimeStartShow: null,
        // checkInTimeEndShow: null,
        // checkOutTimeStartShow: null,
        // checkOutTimeEndShow: null,
        outOfTimeSignShow: null,
        timeOutSignShow: null,
        createStartTimeShow: null,
        createEndTimeShow: null,
        // latestModifyTimeStartShow: null,
        // latestModifyTimeEndShow: null,
      };
    },
    async getOrder(params) {
      const res = await httpMethod({
        url: '/v1/api/order/list',
        method: 'GET',
        params,
      });
      // res.data[0].outOfTimeSign = true;
      // res.data[1].timeOutSign = true;
      this.orderList = res.data;
    },
    methodFormReset() {
      this.searchParams = this.getParamsOrigin();
    },
    methodProcessParams() {
      const {
        // roomType,
        status,
        orderIdShow,
        nameShow,
        phoneShow,
        // emailShow,
        nationalityShow,
        breakfastShow,
        // latestModifyAccountShow,
        // noteShow,
        // checkInTimeStartShow,
        // checkInTimeEndShow,
        // checkOutTimeStartShow,
        // checkOutTimeEndShow,
        outOfTimeSignShow,
        timeOutSignShow,
        createStartTimeShow,
        createEndTimeShow,
        // latestModifyTimeStartShow,
        // latestModifyTimeEndShow,
      } = this.searchParams;
      const params = {};
      // if (roomType) params.roomType = roomType;
      if (status) params.status = status;
      if (orderIdShow) params.orderId = orderIdShow;
      if (nameShow) params.name = nameShow;
      if (phoneShow) params.phone = phoneShow;
      if (breakfastShow) params.breakfast = breakfastShow;
      // if (emailShow) params.email = emailShow;
      if (nationalityShow) params.nationality = nationalityShow;
      if (outOfTimeSignShow) params.outOfTimeSign = outOfTimeSignShow;
      if (timeOutSignShow) params.timeOutSign = timeOutSignShow;
      // if (latestModifyAccountShow) params.latestModifyAccount = latestModifyAccountShow;
      // if (noteShow) params.note = noteShow;
      // if (checkInTimeStartShow) params.checkInTimeStart = new Date(checkInTimeStartShow).valueOf();
      // if (checkInTimeEndShow) params.checkInTimeEnd = new Date(checkInTimeEndShow).valueOf();
      // if (checkOutTimeStartShow) params.checkOutTimeStart = new Date(checkOutTimeStartShow).valueOf();
      // if (checkOutTimeEndShow) params.checkOutTimeEnd = new Date(checkOutTimeEndShow).valueOf();
      if (!outOfTimeSignShow && !timeOutSignShow) {
        if (createStartTimeShow) params.createStartTime = new Date(createStartTimeShow).valueOf();
        if (createEndTimeShow) params.createEndTime = new Date(createEndTimeShow).valueOf();
      }
      // if (latestModifyTimeStartShow) params.latestModifyTimeStart = new Date(latestModifyTimeStartShow).valueOf();
      // if (latestModifyTimeEndShow) params.latestModifyTimeEnd = new Date(latestModifyTimeEndShow).valueOf();
      this.getOrder(params);
    },
    methodChangeOpenDialog(val) {
      this.confirmDialogInfo.openDialog = val;
    },
    methodAddOrder() {
      this.confirmDialogInfo = {
        ...this.confirmDialogInfo,
        openDialog: true,
        title: '新增訂單',
        contentFilePath: 'pages/order/addOrder.vue',
        otherMethod: this.getOrder,
        width: 1000,
      };
    },
    methodUpdateStatus(rowData) {
      this.confirmDialogInfo = {
        ...this.confirmDialogInfo,
        openDialog: true,
        title: '更新狀態',
        contentFilePath: 'pages/order/updateStatus.vue',
        otherMethod: this.getOrder,
        contentData: rowData,
        width: 800,
      };
    },
    methodUpdateOrder(rowData) {
      this.confirmDialogInfo = {
        ...this.confirmDialogInfo,
        openDialog: true,
        title: '更新訂單資訊',
        contentFilePath: 'pages/order/updateOrder.vue',
        otherMethod: this.getOrder,
        contentData: rowData,
        width: 1200,
      };
    },
    methodDetailTableFormat(val, format) {
      if (format === 'time') {
        return this.dateTime(val);
      }
      if (format === 'string') {
        return val.toString();
      }
      if (format === 'roomType') {
        return this.formatRoomType(val);
      }
      if (format === 'money') {
        return this.currencies(val);
      }
      return val || '無';
    },
    async methodBackTest() {
      const data = {
        roomInfo: [
          { date: 20190217, roomCid: 'a' },
          { date: 20190217, roomCid: 'a' },
          { date: 20190217, roomCid: 'b' },
          { date: 20190217, roomCid: 'c' },
          { date: 20190218, roomCid: 'a' },
          { date: 20190218, roomCid: 'b' },
          { date: 20190219, roomCid: 'a' },
          { date: 20190219, roomCid: 'b' },
          { date: 20190220, roomCid: 'a' },
          { date: 20190220, roomCid: 'b' },
          { date: 20190221, roomCid: 'a' },
        ],
      };
      const res = await httpMethod({
        url: '/v1/api/order/test',
        method: 'POST',
        data,
      });
    },
  },
};
</script>
