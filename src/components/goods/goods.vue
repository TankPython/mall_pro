<template>
  <div>
    <bread level1="商品管理" level2="商品列表"></bread>
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" v-model="searchValue" clearable>
        <el-button slot="append" icon="el-icon-search" @click="loadGoodslist"></el-button>
      </el-input>
      <el-button type="primary" @click="goodsAdd">添加商品</el-button>
    </div>

    <el-table :data="tableData" style="width: 100%; margin-top: 15px;">
      <el-table-column type="index" prop="index" label="#"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>

      <el-table-column label="创建日期">
        <template slot-scope="dataTable">
          <div>{{dataTable.row.add_time|dateFmt('YYYY-MM-DD')}}</div>
        </template>
      </el-table-column>

      <el-table-column prop label="操作">
        <!-- 编辑按钮 -->
        <el-button type="primary" icon="el-icon-edit" plain circle></el-button>

        <!-- 删除按钮 -->
        <el-button type="danger" icon="el-icon-delete" plain circle></el-button>
      </el-table-column>
    </el-table>

    <div class="block" style="margin-top: 15px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[3, 6, 9, 12]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goodsAdd() {
      this.$router.push({ name: "goodsAdd" });
    },
    // 加载用户列表
    async loadGoodslist() {
      console.log("load---");

      const res = await this.$http.get(
        "goods" +
          `?query=${this.searchValue}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      const {
        data: { goods, total },
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.tableData = goods;
        this.$message.success(msg);
        this.total = total;
        console.log("total=", total);
      } else {
        this.$message.warning(msg);
      }
      console.log("users=====", res.data);
    },
    // 页码尺寸改变
    handleSizeChange(val) {
      this.pagenum = 1;
      this.pagesize = val;
      this.loadGoodslist();
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadGoodslist();
      // console.log(`当前页: ${val}`)
    }
  },
  mounted() {
    this.loadGoodslist();
  },
  data() {
    return {
      searchValue: "",
      tableData: [],
      pagenum: 1,
      pagesize: 10,
      total: 1
    };
  }
};
</script>

<style>
.el-input {
  width: 400px;
}
</style>