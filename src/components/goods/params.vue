<template>
  <div>
    <bread level1="商品管理" level2="分类参数"></bread>
    <el-alert title="
注意：只允许为第三级分类设置相关参数！" type="warning" left show-icon style="margin-top: 15px;"></el-alert>
    <el-form style="margin-top: 15px;">
      <el-form-item label="商品分类">
        <el-cascader
          v-model="catgloryValue"
          :options="options"
          :props="props"
          @change="handleChange"
          clearable
        ></el-cascader>
      </el-form-item>

      <el-tabs v-model="active" @tab-click="tab_click">
        <el-tab-pane label="动态参数" name="1">
          <el-button type="primary" :disabled="this.catgloryValue.length < 3">添加参数</el-button>

          <el-table :data="dynamicPara" style="width: 100%; margin-top: 15px;">
            <el-table-column type="expand" label>
              <template slot-scope="data">
                <el-tag
                  type="success"
                  closable
                  v-for="(item,i) in data.row.attr_vals"
                  :key="i"
                >{{item}}</el-tag>
                <el-input
                  style="width: 200px;"
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(data.row)"
                  @blur="handleInputConfirm(data.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>

            <el-table-column type="index" prop="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>

            <el-table-column prop label="操作">
              <!-- 编辑按钮 -->
              <el-button type="primary" icon="el-icon-edit" plain circle></el-button>

              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" plain circle></el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="2">
          <el-button type="primary" :disabled="this.catgloryValue.length < 3">添加属性</el-button>

          <el-table :data="staticData" style="width: 100%; margin-top: 15px;">
            <el-table-column type="expand" label>
              <template slot-scope="data">
                <el-tag
                  type="success"
                  closable
                  v-for="(item,i) in data.row.attr_vals"
                  :key="i"
                >{{item}}</el-tag>
                <el-input
                  style="width: 200px;"
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(data.row)"
                  @blur="handleInputConfirm(data.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>

            <el-table-column type="index" prop="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>

            <el-table-column prop label="操作">
              <!-- 编辑按钮 -->
              <el-button type="primary" icon="el-icon-edit" plain circle></el-button>

              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" plain circle></el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputVisible: false,
      inputValue: "",
      staticData: [],
      dynamicPara: [],
      active: "1",
      options: [],
      catgloryValue: [],
      props: {
        expandTrigger: "hover",
        label: "cat_name",
        children: "children",
        value: "cat_id"
      }
    };
  },
  methods: {
    handleInputConfirm(row) {
      let inputValue = this.inputValue;
      if (inputValue) {
        row.attr_vals.push(inputValue);
        console.log("row=", row);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    tab_click() {
      if (this.catgloryValue.length < 3) return;

      if (this.active == "1") {
        this.loadDynamicData();
      }
      if (this.active == "2") {
        this.loadStaticData();
      }
    },
    handleChange() {
      if (this.catgloryValue.length < 3) {
        this.dynamicPara = [];
        this.staticData = [];
        return;
      }
      this.loadDynamicData();
      this.loadStaticData();
    },
    async loadCategoties() {
      const res = await this.$http.get("categories", { type: 3 });
      const {
        data,
        meta: { status, msg }
      } = res.data;
      this.options = data;
    },
    async loadDynamicData() {
      const res = await this.$http.get(
        `categories/${this.catgloryValue[2]}/attributes?sel=many`
      );
      console.log("dy=", res.data);
      const {
        data,
        meta: { status, msg }
      } = res.data;
      this.dynamicPara = data;
      this.dynamicPara.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
      });
    },
    async loadStaticData() {
      const res = await this.$http.get(
        `categories/${this.catgloryValue[2]}/attributes?sel=only`
      );
      console.log("static=", res.data);
      const {
        data,
        meta: { status, msg }
      } = res.data;
      this.staticData = data;
      this.staticData.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
      });
    }
  },
  mounted() {
    this.loadCategoties();
  }
};
</script>

<style>
.el-tag {
  margin-left: 10px;
  margin-bottom: 10px;
}
</style>
