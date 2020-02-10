<template>
  <div>
    <bread level1="商品管理" level2="商品列表"></bread>
    <el-alert title="消息提示的文案" type="info" center show-icon style="margin-top: 15px;"></el-alert>
    <el-steps :active="active*1" finish-status="success" style="margin-top: 15px;">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>

    <el-form label-position="top" label-width="100%" :model="form">
      <!-- 看似是一个el-tab标签实际可以v-model绑定，是form表单 -->
      <el-tabs
        tab-position="left"
        style="margin-top: 15px;"
        @tab-click="tab_click"
        v-model="active"
        :before-leave="leave"
      >
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="catgloryValue"
              :options="options"
              :props="props"
              @change="handleChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item.attr_name" v-for="(item,i) in dynamicPara" :key="i">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                border
                closable
                v-for="(item1,i) in item.attr_vals"
                :key="i"
                :label="item1"
              >{{item1}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item.attr_name" v-for="(item,i) in staticData" :key="i">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-upload
            :headers="headers"
            class="upload-demo"
            action="http://127.0.0.1:8888/api/private/v1/upload"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <quillEditor style="height: 400px;" v-model="form.goods_introduce"></quillEditor>
          <el-form-item style="margin-top: 45px;">
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data () {
    return {
      headers: { Authorization: sessionStorage.getItem('token') },
      active: '1',
      form: {
        pics: []
      },
      options: [],
      catgloryValue: [],
      props: {
        expandTrigger: 'hover',
        label: 'cat_name',
        children: 'children',
        value: 'cat_id'
      },
      dynamicPara: [],
      staticData: [],
      fileList: []
    }
  },
  methods: {
    leave () {
      if (this.active === '1') {
        if (this.catgloryValue.length !== 3) {
          this.$message.error('请选择三级分类')
          return false
        }
      }
      return true
    },
    //   添加商品
    async addGoods () {
      console.log('add--')
      var attrs = []
      this.dynamicPara.forEach(el => {
        el.attr_vals.forEach(el1 => {
          attrs.push({ attr_id: el.attr_id, attr_value: el1 })
        })
      })
      var form = {
        goods_name: this.form.goods_name,
        goods_price: this.form.goods_price,
        goods_number: this.form.goods_number,
        goods_weight: this.form.goods_weight,
        goods_introduce: this.form.goods_introduce,
        goods_cat: this.catgloryValue.join(','),
        attrs: attrs,
        pics: this.form.pics
      }
      const res = await this.$http.post('goods', form)
      const {
        data,
        meta: { msg }
      } = res.data
      console.log('----888----', form)
      this.$message.info(msg)
      console.log(data)
      this.$router.push({ name: 'goods' })
    },
    handleRemove (file, fileList) {
      var index = this.form.pics.findIndex(el => {
        return file.name === el.pic
      })
      this.form.pics.splice(index, 1)
    },
    handleSuccess (response, file, fileList) {
      console.log(response)
      this.form.pics.push({
        pic: response.data.tmp_path
      })
    },
    async tab_click () {
      // 商品动态参数
      if (this.active === '2') {
        console.log(this.catgloryValue.length, '-----lengh')
        const res = await this.$http.get(
          `categories/${this.catgloryValue[2]}/attributes?sel=many`
        )
        console.log('dy=', res.data)
        const {
          data
        } = res.data
        this.dynamicPara = data
        this.dynamicPara.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
      }
      // 商品静态参数
      if (this.active === '3') {
        const res = await this.$http.get(
          `categories/${this.catgloryValue[2]}/attributes?sel=only`
        )
        console.log('static=', res.data)
        const {
          data
        } = res.data
        this.staticData = data
      }
    },
    // 获取三级分类
    async loadCategoties () {
      const res = await this.$http.get('categories', { type: 3 })
      const {
        data
      } = res.data
      this.options = data
    },
    handleChange (value) {
      this.dynamicPara = []
    }
  },
  mounted () {
    this.loadCategoties()
  }
}
</script>
<style>
</style>
