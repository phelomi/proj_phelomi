<template>
  <div class="add-room-repair">
    <v-form v-model="valid" ref="form" class="px-2" lazy-validation>
      <v-layout row wrap>
        <v-flex sm12 md4 lg3 px-1 >
          <v-select
            v-model="repairParams.roomId"
            :items="constList.roomTypeList"
            item-text="value"
            item-value="id"
            label="房型"
            :rules="nameRules"
            required
          ></v-select>
        </v-flex>
        <v-flex
          sm12
          md4
          lg3
          px-1
          v-for="(item, idx) in repairItemParams1"
          :key="`repairItemParams1${idx}`"
        >
          <v-text-field
            v-model="repairParams[item.key]"
            :label="item.label"
            clearable
            :rules="item.require ? nameRules : []"
            :required="item.require"
          ></v-text-field>
        </v-flex>
        <v-flex
          sm12
          md4
          lg3
          px-1
          v-for="(item, idx) in numberParams"
          :key="`numberParams${idx}`"
        >
          <v-text-field
            type="number"
            min="0"
            v-model="repairParams[item.key]"
            :label="item.label"
            clearable
            :rules="nameRules"
            required
          ></v-text-field>
        </v-flex>
        <v-flex
          sm12
          md4
          lg3
          px-1
          v-for="(item, idx) in repairItemParams2"
          :key="`repairItemParams2${idx}`"
        >
          <v-text-field
            v-model="repairParams[item.key]"
            :label="item.label"
            clearable
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex text-xs-right>
          <v-btn flat @click="methodCancelAddOrder">取消</v-btn>
          <v-btn flat @click="methodFormReset">重置</v-btn>
          <v-btn color="primary" @click="methodProcessParams">
            <v-icon>mdi-check</v-icon>新增維修事項
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </div>
</template>
<script>
import httpMethod from '@/utils/httpMethod';
import constList from '@/utils/const';

export default {
  name: 'addRoomRepair',
  data() {
    return {
      constList,
      valid: false,
      repairParams: this.getParamsOrigin(),
      repairItemParams1: [
        { label: '維修位置', key: 'positionShow', require: true },
        { label: '維修內容', key: 'contentShow', require: true },
      ],
      numberParams: [
        { label: '自修配件費', key: 'internalCostShow' },
        { label: '委外維修費', key: 'outsourceCostShow' },
      ],
      repairItemParams2: [
        { label: '備註', key: 'noteShow' },
      ],
      nameRules: [
        v => !!v || '此欄位為必填',
      ],
    };
  },
  methods: {
    getParamsOrigin() {
      return {
        roomId: null,
        positionShow: null,
        contentShow: null,
        internalCostShow: null,
        outsourceCostShow: null,
        noteShow: null,
      };
    },
    methodFormReset() {
      this.repairParams = this.getParamsOrigin();
      this.$refs.form.resetValidation();
    },
    methodProcessParams() {
      const {
        roomId,
        positionShow,
        contentShow,
        internalCostShow,
        outsourceCostShow,
        noteShow,
      } = this.repairParams;
      const params = {};
      if (roomId) params.roomId = roomId;
      if (positionShow) params.position = positionShow;
      if (contentShow) params.content = contentShow;
      if (internalCostShow) params.internalCost = internalCostShow * 100;
      if (outsourceCostShow) params.outsourceCost = outsourceCostShow * 100;
      if (noteShow) params.note = noteShow;
      this.addOrder(params);
    },
    async addOrder(params) {
      if (this.$refs.form.validate()) {
        const res = await httpMethod({
          url: '/v1/api/room/maintenance/add',
          method: 'POST',
          data: params,
        });
        let alert = null;
        if (!res.code) {
          alert = {
            open: true,
            text: `${res.msg}`,
            color: 'success',
          };
        } else {
          alert = {
            open: true,
            text: res.msg || '新增失敗，請重新再試，或聯絡客服人員',
            color: 'error',
          };
        }
        this.$store.commit('global/setNotifySetting', alert);
        // this.orderList = res.data;
        this.methodCancelAddOrder();
        this.$emit('execOtherMethod');
      }
    },
    methodCancelAddOrder() {
      this.methodFormReset();
      this.$emit('closeDialog');
    },
  },
};
</script>
