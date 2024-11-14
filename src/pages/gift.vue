<template>
  <v-card
    style="background-color: rgba(255, 255, 255, 0.8);box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);border-radius: 20px;">
    <v-card-item>
      <v-card-title style="margin-top: 10px"><h2>豆力巅峰榜</h2></v-card-title>
    </v-card-item>

    <v-card-text>
      <v-data-table-virtual
        :loading="loadingGifts"
        loading-text="加载中..."
        style="background-color: rgba(255, 255, 255, 0.6)"
        density="comfortable"
        :headers="headers"
        :items="gifts"
        class="border"
        item-value="user_uid"
        :hide-default-footer="true"
      >
        <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
          <tr>
            <template v-for="column in columns" :key="column.key">
              <th style="font-weight: bold;text-align: center">
                {{ column.title }}
              </th>
            </template>
          </tr>
        </template>
      </v-data-table-virtual>
      <v-row align="center" style="width: 80%;margin: 0 auto;">
        <v-col cols="12" class="text-center" style="margin-top: 10px"><h2>检测豆力修炼值</h2></v-col>
        <v-col cols="12" align-self="center">
          <v-text-field
            :loading="loading"
            density="comfortable"
            label="输入用户UID"
            type="text"
            variant="outlined"
            hide-details
            single-line
            v-model="currentUID"
          ></v-text-field>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-btn
            border="success"
            color="success"
            class="text-none"
            variant="flat"
            flat
            @click="run(currentUID)"
          >检测
          </v-btn>
        </v-col>
        <v-col v-if="userGift" cols="12" class="text-h6 text-center">
          <span v-if="error" class="text-error">查询出错，请重试。</span>
          <span
            v-else>{{
              `用户名: ${userGift.username} ,UID: ${userGift.user_uid}, 豆力修炼值: ${userGift.gift_count}, 豆力等级:${userGift.rankTitle}`
            }}</span>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import {useRequest} from "vue-hooks-plus";
import {getGiftCountApi, getGiftRankingApi} from "@/api";

const headers = [
  {title: '豆力等级', align: 'center', key: 'rankTitle', sortable: false},
  {title: '用户名', align: 'center', key: 'username', sortable: false},
  {title: 'UID', align: 'center', key: 'user_uid', sortable: false},
  {title: '豆力修炼值', align: 'center', key: 'gift_count', sortable: false},
];

const {data: gifts, loading: loadingGifts} = useRequest(getGiftRankingApi, {
  onSuccess: data => {
    data.forEach(item => {
      item.rankTitle = calculateRankTitle(item.gift_count);
    })
  }
});
const rankData = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000];
const rankTitles = ['豆之气', '豆者', '豆师', '大豆师', '豆灵', '豆王', '豆皇', '豆宗'];
const currentUID = ref('');
const calculateRankTitle = (giftCount) => {
  if (giftCount <= 0) {
    return '无称号';
  }
  for (let i = 0; i < rankData.length; i++) {
    if (giftCount < rankData[i]) {
      return rankTitles[i - 1] + Math.floor(giftCount / rankData[i - 1]) + '星';
    }
  }

  return '无称号'
}
const {data: userGift, loading, run, error} = useRequest(getGiftCountApi, {
  manual: true,
  onSuccess: data => {
    data.rankTitle = calculateRankTitle(data.gift_count);
  },
})
</script>

<style scoped>

</style>
