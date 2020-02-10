<template>
  <div>
    <bread level1="商品管理" level2="商品分类"></bread>
    <el-button type="primary" style="margin-top: 15px;" plain>添加分类</el-button>

    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;margin-top: 15px;"
      row-key="cat_id"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >

      <el-table-column type="index" prop="index" label="#"></el-table-column>
      <el-table-column prop="cat_name" label="分类名称" sortable></el-table-column>
      <el-table-column prop="cat_deleted" label="是否有效" sortable></el-table-column>
      <el-table-column prop="cat_level" label="排序"></el-table-column>
      <el-table-column prop label="操作">
        <!-- 编辑按钮 -->
        <el-button type="primary" icon="el-icon-edit" plain circle></el-button>

        <!-- 删除按钮 -->
        <el-button type="danger" icon="el-icon-delete" plain circle></el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    async loadCategoties () {
      const res = await this.$http.get('categories', { type: 3 })
      const {
        data
      } = res.data
      this.tableData = data
      console.log('data=', data)
    }
  },
  mounted () {
    this.loadCategoties()
  }
}
</script>

<style>
</style>
