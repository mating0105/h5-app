<template>
  <div v-if="fileList.length>0 || data.deletable">
    <div class="xh-image-item-title" v-if="fileList.length>0 || data.deletable">
      <span v-if="data.isRequire" class="xh-is-require">*</span>
      {{data.declare}}
    </div>
    <van-uploader
      multiple
      :after-read="upload"
      :deletable="data.deletable"
      class="xh-image-upload"
      :class="{'xh-image-deletable': !data.deletable}"
      :disabled="!data.deletable"
      v-model="fileList"
      :before-delete="deleteImage"
      @click-preview="clickPreview(fileList)"
      @close-preview="closePreview"
    />
  </div>
</template>

<script>
import { Uploader, Dialog, Toast } from "vant";
import Exif from "exif-js";

import Vue from "vue";
import { uploadsDocument, removeDocument } from "@/api/document";

Vue.use(Uploader).use(Toast);

export default {
  name: "item",
  props: {
    data: {
      default: function() {
        return {
          isRequire: true,
          declare: "照片描述",
          deletable: false,
          fileList: []
        };
      }
    }
  },
  data() {
    return {
      fileList: [],
      headerImage: ""
    };
  },
  methods: {
    clickPreview(list) {
      var _this = this;
      var button = document.getElementsByClassName("van-image-preview");
      for (var i = 0; i < button.length; i++) {
        if (button[i].childNodes.length == 2) {
          var newDiv = document.createElement("div");
          newDiv.id = "downLoadbuttonClass";
          newDiv.innerText = "下载图片";
          button[i].appendChild(newDiv);
        }
      }
      var buttonClass = document.getElementById("downLoadbuttonClass");
      var index;
      buttonClass.onclick = () => {
        for (var i = 0; i < button.length; i++) {
          index = Number(
            button[i]
              .getElementsByClassName("van-image-preview__index")[0]
              .textContent.split(" / ")[0]
          );
        }
        Dialog.confirm({
          title: "下载图片",
          message: "是否确认下载图片？"
        })
          .then(() => {
            console.log("确认");
            let para = {
              pic: list[index - 1].base64File
            };
            _this.$bridge.callHandler("savePic", para, res => {
              if (res) {
                Toast.success("下载成功");
              } else {
                Toast.fail("下载失败");
              }
            });
          })
          .catch(() => {
            // on cancel
          });
      };
    },
    closePreview() {
      var El = document.getElementById("downLoadbuttonClass");
      El.parentNode.removeChild(El);
    },
    /**
     * 删除照片
     * @return {Promise<any>}
     */
    deleteImage(file, { index }) {
      return new Promise((resolve, reject) => {
        Dialog.confirm({
          title: "删除",
          message: "确定删除照片吗？"
        })
          .then(async () => {
            try {
              const params = {
                documentId: file.documentId
              };
              await removeDocument(params);
              this.$toast.success("删除成功");
              this.data.fileList.splice(index, 1);
              resolve();
            } catch (e) {
              reject();
              console.log(e);
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
    /**
     * 上传文件
     * @return {Promise<any>}
     */
    async afterRead(file, { index }) {
      try {
        const params = {
          kind: this.data.kind,
          customerNum: this.data.customerNum,
          documentType: this.data.documentType,
          customerId: this.data.customerId,
          file
        };
        const { data } = await uploadsDocument(params);
        data.forEach(item => {
          item.documentRoute = item.fileUrl;
          item.url = item.fileUrl;
          item.declare = this.data.declare;
          item.declare = this.data.declare;
        });
        this.data.fileList.splice(index, 0, ...data);
        for (let i = 0; i < data.length; i++) {
          console.log(data[i], "data[i]");
          this.fileList[index + i].documentId = data[i].documentId;
          this.fileList[index + i].base64File = data[i].base64File;
          this.fileList[index + i].documentRoute = data[i].documentRoute;
          this.fileList[index + i].url = data[i].url;
        }
        this.$emit("update:loading", false);
        this.$nextTick(() => {
          this.$toast.success("保存成功");
        });
      } catch (e) {
        this.$emit("update:loading", false);
        console.log(e);
      }
    },
    async upload(file, index) {
      try {
        this.$emit("update:loading", true);
        if (Object.prototype.toString.call(file) === "[object Array]") {
          let imgList = [];
          file.forEach(item => {
            imgList.push(this.imgPreview(item.file));
          });
          Promise.all(imgList).then(fileList => {
            this.afterRead(fileList, index);
          });
        } else {
          const file1 = await this.imgPreview(file.file);
          this.afterRead(file1, index);
        }
      } catch (e) {
        this.$emit("update:loading", false);
        console.log(e);
      }
    },
    imgPreview(file) {
      return new Promise((resolve, reject) => {
        let self = this;
        let Orientation;
        //去获取拍照时的信息，解决拍出来的照片旋转问题
        Exif.getData(file, function() {
          Orientation = Exif.getTag(this, "Orientation");
        });
        // 看支持不支持FileReader
        if (!file || !window.FileReader) return;

        if (/^image/.test(file.type)) {
          // 创建一个reader
          let reader = new FileReader();
          // 将图片2将转成 base64 格式
          reader.readAsDataURL(file);
          // 读取成功后的回调
          reader.onloadend = function() {
            let result = this.result;
            let img = new Image();
            img.src = result;
            //判断图片是否大于100K,是就直接上传，反之压缩图片
            if (this.result.length <= 100 * 1024) {
              file = self.dataURLtoFile(result);
              // self.afterRead(file);
              resolve(file);
            } else {
              img.onload = function() {
                let data = self.compress(img, Orientation);
                file = self.dataURLtoFile(data);
                // self.afterRead(file);
                resolve(file);
              };
            }
          };
        }
      });
    },
    // base64转文件
    dataURLtoFile: function(dataurl, filename = new Date() + ".jpg") {
      let arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]),
        n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    rotateImg(img, direction, canvas) {
      //最小与最大旋转方向，图片旋转4次后回到原方向
      const min_step = 0;
      const max_step = 3;
      if (img == null) return;
      //img的高度和宽度不能在img元素隐藏后获取，否则会出错
      let height = img.height;
      let width = img.width;
      let step = 2;
      if (step == null) {
        step = min_step;
      }
      if (direction == "right") {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
      } else {
        step--;
        step < min_step && (step = max_step);
      }
      //旋转角度以弧度值为参数
      let degree = (step * 90 * Math.PI) / 180;
      let ctx = canvas.getContext("2d");
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }
    },
    compress(img, Orientation) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      //瓦片canvas
      let tCanvas = document.createElement("canvas");
      let tctx = tCanvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = (width * height) / 4000000) > 1) {
        console.log("大于400万像素");
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      //        铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      let count;
      if ((count = (width * height) / 1000000) > 1) {
        console.log("超过100W像素");
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
        //            计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(
              img,
              i * nw * ratio,
              j * nh * ratio,
              nw * ratio,
              nh * ratio,
              0,
              0,
              nw,
              nh
            );
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      //修复ios上传图片的时候 被旋转的问题
      if (Orientation != "" && Orientation != 1) {
        switch (Orientation) {
          case 6: //需要顺时针（向左）90度旋转
            this.rotateImg(img, "left", canvas);
            break;
          case 8: //需要逆时针（向右）90度旋转
            this.rotateImg(img, "right", canvas);
            break;
          case 3: //需要180度旋转
            this.rotateImg(img, "right", canvas); //转两次
            this.rotateImg(img, "right", canvas);
            break;
        }
      }
      //进行最小压缩
      let ndata = canvas.toDataURL("image/jpeg", 0.5);
      console.log("压缩前：" + initSize);
      console.log("压缩后：" + ndata.length);
      console.log(
        "压缩率：" + ~~((100 * (initSize - ndata.length)) / initSize) + "%"
      );
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    }
  },
  mounted() {
    if (this.data && this.data.fileList) {
      this.fileList = this.data.fileList.map(item => {
        return {
          url: item.documentRoute,
          base64File: item.base64File,
          ...item
        };
      });
    }
  }
};
</script>

<style lang="scss">
.xh-is-require {
  color: red;
}

.xh-image-deletable .van-uploader__upload {
  display: none;
}

.xh-image-upload {
  .van-uploader__upload-icon {
    font-size: 2.5rem;
  }
  .van-uploader__preview-delete {
    color: rgb(235, 34, 40);
  }
}

.xh-image-item-title {
  color: #333333;
  margin: 14.5px 0 16px 0;
  font-size: 1.2rem;
}
#downLoadbuttonClass {
  width: 100px;
  height: 46px;
  background-color: #1989fa;
  border-radius: 30px;
  position: absolute;
  bottom: 10px;
  right: 10px;
  text-align: center;
  line-height: 46px;
  color: #fff;
}
</style>
