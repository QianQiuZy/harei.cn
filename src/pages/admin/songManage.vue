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
      height="65vh"
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
              clearable
              label="语言"
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

        <v-toolbar
          flat
          density="compact"
          color="transparent"
        >

          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                class="mb-2"
                color="primary"
                dark
                v-bind="props"
              >
                添加歌曲
              </v-btn>
            </template>
            <v-card>
              <v-card-title style="margin-top: 15px">
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <div class="text-subtitle-1 text-medium-emphasis">歌曲名称</div>

                <v-text-field
                  v-model="editedItem.title"
                  density="compact"
                  placeholder="歌曲名称"
                  prepend-inner-icon="mdi-email-outline"
                  variant="outlined"
                ></v-text-field>

                <div class="text-subtitle-1 text-medium-emphasis">歌手</div>
                <v-text-field
                  v-model:value="editedItem.artist"
                  density="compact"
                  placeholder="歌手"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
                ></v-text-field>
                <div class="text-subtitle-1 text-medium-emphasis">类型</div>
                <v-text-field
                  v-model:value="editedItem.type"
                  density="compact"
                  placeholder="类型"
                  prepend-inner-icon="mdi-tag"
                  variant="outlined"
                ></v-text-field>
                <div class="text-subtitle-1 text-medium-emphasis">语言</div>
                <v-text-field
                  v-model:value="editedItem.language"
                  density="compact"
                  placeholder="语言"
                  prepend-inner-icon="mdi-book-open"
                  variant="outlined"
                ></v-text-field>
                <div class="text-subtitle-1 text-medium-emphasis">备注</div>
                <v-text-field
                  v-model:value="editedItem.note"
                  density="compact"
                  placeholder="备注"
                  prepend-inner-icon="mdi-comment"
                  variant="outlined"
                ></v-text-field>

              </v-card-text>
              <v-divider class="mt-2"></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="close"
                >
                  取消
                </v-btn>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="save"
                >
                  保存
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5 text-center" style="margin-top: 15px">你确定要删除该歌曲吗？</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">取消</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">确认</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          class="me-2"
          size="small"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          size="small"
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        暂无数据
      </template>

    </v-data-table-virtual>
  </v-card>
</template>

<script setup>
import {useDisplay} from 'vuetify'
import {music} from "@/api";
import {useRequest} from "vue-hooks-plus";

const {xs} = useDisplay()

const dialog = ref(false);
const dialogDelete = ref(false);
const formTitle = ref('添加歌曲');
const typeFilter = ref([]);
const languageFilter = ref([]);
const search = ref('');
const headers = [
  {title: '歌曲名称', align: 'start', key: 'title'},
  {title: '歌手', align: 'end', key: 'artist'},
  {title: '类型', align: 'end', key: 'type', filterable: false},
  {title: '语言', align: 'end', key: 'language', filterable: false},
  {title: '备注', align: 'end', key: 'note', filterable: false},
  {title: '操作', key: 'actions', sortable: false, filterable: false},
];
const editedItem = ref({
  title: '',
  artist: '',
  type: '',
  language: '',
  note: '',
});
const editedIndex = ref(-1);
const defaultItem = {
  title: '',
  artist: '',
  type: '',
  language: '',
  note: '',
};
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
const deleteItem = (item) => {
  editedIndex.value = songsData.value.indexOf(item);
  editedItem.value = {...item};
  dialogDelete.value = true;
}
const deleteItemConfirm = () => {
  songsData.value.splice(editedIndex.value, 1);
  dialogDelete.value = false;
  editedIndex.value = -1;
}
const editItem = (item) => {
  editedIndex.value = songsData.value.indexOf(item);
  editedItem.value = {...item};
  dialog.value = true;
}

const reset = () => {

}

const save = () => {
  console.log(editedItem.value);
}

const close = () => {
  dialog.value = false
  nextTick(() => {
    editedItem.value = {...defaultItem}
    editedIndex.value = -1
  })
}
const closeDelete = () => {
  dialogDelete.value = false
  nextTick(() => {
    editedItem.value = {...defaultItem}
    editedIndex.value = -1
  })
}
</script>

<style scoped>

</style>
