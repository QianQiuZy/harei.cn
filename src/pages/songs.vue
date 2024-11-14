<template>
  <v-card
    style="background-color: rgba(255, 255, 255, 0.9);    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);opacity: 0.8;"
  >
    <v-data-table-virtual
      :search="filterData"
      :custom-filter="filterSong"
      :headers="headers"
      :items="songsData"
      style="padding: 16px"
      height="75vh"
      item-value="title"
      :loading="loading"
      no-data-text="暂无数据"
      loading-text="加载中..."
    >
      <template v-slot:top>
        <v-row align-content="space-between">
          <v-col :cols="xs ? 12 :6" sm="12" md="6" lg="6" xl="6">
            <v-text-field
              v-model="search"
              label="搜索歌曲或歌手"
              density="compact"
              flat
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              single-line
            ></v-text-field>
          </v-col>
          <v-col v-if="!xs">
            <v-select
              density="compact"
              v-model="typeFilter"
              :items="types"
              variant="outlined"
              label="类型"
              multiple
              clearable
            >
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index < 2">
                  <span>{{ item.title }}</span>
                </v-chip>
                <span
                  v-if="index === 2"
                  class="text-grey text-caption align-self-center"
                >(+{{ typeFilter.length - 2 }} 其他)</span>
              </template>
            </v-select>
          </v-col>
          <v-col v-if="!xs">
            <v-select
              density="compact"
              v-model="languageFilter"
              :items="languages"
              variant="outlined"
              multiple
              label="语言"
              clearable
            >
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index < 2">
                  <span>{{ item.title }}</span>
                </v-chip>
                <span
                  v-if="index === 2"
                  class="text-grey text-caption align-self-center"
                >(+{{ languageFilter.length - 2 }} 其他)</span>
              </template>
            </v-select>
          </v-col>
        </v-row>
      </template>
    </v-data-table-virtual>
  </v-card>
</template>

<script setup>
import {useDisplay} from 'vuetify'
import {music} from "@/api";
import {useRequest} from "vue-hooks-plus";
import {useToast} from "vue-toast-notification";

const {xs} = useDisplay()


const typeFilter = ref([]);
const languageFilter = ref([]);
const search = ref('');
const headers = [
  {title: '歌曲名称', align: 'start', key: 'title'},
  {title: '歌手', align: 'end', key: 'artist'},
  {title: '类型', align: 'end', key: 'type', filterable: false},
  {title: '语言', align: 'end', key: 'language', filterable: false},
  {title: '备注', align: 'end', key: 'note', filterable: false},
];

const {data: songsData, loading} = useRequest(music, {
  onError: error => {
    console.error('获取歌曲数据出错:', error)
  }
});

const types = computed(() => {
  if (!songsData.value) {
    return [];
  }
  const typeSet = new Set();
  for (let song of songsData.value) {
    typeSet.add(song.type);
  }
  return Array.from(typeSet);

})
const languages = computed(() => {
  if (!songsData.value) {
    return [];
  }
  const languageSet = new Set();
  for (let song of songsData.value) {
    languageSet.add(song.language);
  }
  return Array.from(languageSet);
});
const filterData = computed(() => {
  return JSON.stringify({search: search.value, type: typeFilter.value, language: languageFilter.value});
})
const filterSong = (_value, query, item) => {
  if (!item) {
    return false;
  }
  let result = true;
  if (search.value) {
    result = item.columns.title.includes(search.value) || item.columns.artist.toString().includes(search.value);
  }
  if (typeFilter.value && typeFilter.value.length > 0 && result) {
    result = typeFilter.value.includes(item.columns.type);
  }
  if (languageFilter.value && languageFilter.value.length > 0 && result) {
    result = languageFilter.value.includes(item.columns.language);
  }
  return result;
}
</script>

<style scoped>

</style>
