<template>
    <div class="attachfiles-block grid-type1">
        <!-- //Interaction Desc -->
        <div class="btn-attach-wrap">
            <button type="button" :class="{'btn-attch-img': true, 'attch-disable': imgAttachDisable}" v-if="imgMaxFile > 0">
                <i class="icon-img"></i>
                <span>사진 <span class="attch-current-num">{{imgAttachedCnt}}</span>/<span class="attch-total-num">{{imgMaxFile}}</span></span>
                <input type="file" name="files" class="no-show" :disabled="imgAttachDisable" multiple="multiple" :data-maxfile="imgMaxFile" accept="image/*" @change="changedFile('image', $event)" v-if="!isIosApp" />
                <span class="no-visible" :disabled="imgAttachDisable" :data-maxfile="imgMaxFile" @click="imgClicked" v-else />
            </button>
            
            <button type="button" :class="{'btn-attch-mov': true, 'attch-disable': movAttachDisable}" v-if="movMaxFile > 0">
                <i class="icon-mov"></i>
                <span>동영상 <span class="attch-current-num">{{movAttachedCnt}}</span>/<span class="attch-total-num">{{movMaxFile}}</span></span>
                <input type="file" name="files" class="no-show" :disabled="movAttachDisable" :data-maxfile="movMaxFile" accept="video/*" @change="changedFile('video', $event)" v-if="!isIosApp" />
                <span class="no-visible" :disabled="movAttachDisable" :data-maxfile="movMaxFile" @click="movClicked" v-else />
            </button>
        </div>
        <!--
			공통 수정사항
			- 사진/동영상 첨부 파일 : 사진은 최대 10개 / 동영상은 최대 1개
			- 사진은 10개까지 업로드 되고 최대 10개까지 업로드 될시 .btn-attch-img에 .attch-disable class 삽입 /
			  .no-show class명의 input type=file을 disabled 시킴
			- 영상은 1개까지 업로드 되고 최대 1개 업로드 되면 .btn-attch-img에 .attch-disable class 삽입 /
			  .no-show class명의 input type=file을 disabled 시킴
			- 업로드 갯수에 따라 .attch-current-num class명의 숫자 카운트됨
		-->
        <!-- //btn-attach-wrap -->
        <!-- attach-preview-wrap -->
        <!-- //Interaction Desc -->
        <div class="attach-preview-wrap photo-list">
            <ul class="photo-list-ul">
                <li class="swiper-slide" v-for="(file, index) in files" :key="index">
                    <div :class="{'attach-preview-item': true, 'attch-item-img': file.isImage, 'attch-item-mov': !file.isImage}">
                        <img :src="file.url" alt="리뷰제품 이미지" />
                        <button type="button" class="btn-attch-del" @click="removeFile(index)"><i class="icon-delete-white"></i><span>첨부파일삭제</span></button>
                        <i class="button-movie-play2"></i>
                    </div>
                </li>
            </ul>
        </div>
        <!-- //attach-preview-wrap -->
    </div>
</template>

<script>
    module.exports = {
        props: {
            imgMaxFile: {
                type: Number,
                required: true
            },
            movMaxFile: {
                type: Number,
                required: true
            }
        },
        data: function() {
            return {
                files: [],
                imgAttachedCnt: 0,
                movAttachedCnt: 0
            };
        },
        /* ${template} */
        methods: {
            imgClicked: function(event) {
                if (isIosApp()) {
                    console.log('imgClicked - ios');
                    event.preventDefault();

                    // IOS에서 호출할 함수를 재정의
                    window.callAppTakePhoto = function(file) {
                        var fileList = [file];
                        handleFileUploads('image', fileList);
                    };

                    try {
                        window.webkit.messageHandlers.glyde_upload.postMessage('photo');
                    } catch(err) {
                        this.$_popup.alert('IOS 사진 선택이 실패되었습니다. 고객센터로 문의해주시기 바랍니다.');
                    }
                }
            },
            movClicked: function(event) {
                if (isIosApp()) {
                    console.log('movClicked - ios');
                    event.preventDefault();

                    // IOS에서 호출할 함수를 재정의
                    window.callAppTakePhoto = function(file) {
                        var fileList = [file];
                        handleFileUploads('video', fileList);
                    };

                    try {
                        window.webkit.messageHandlers.glyde_upload.postMessage('video');
                    } catch(err) {
                        this.$_popup.alert('IOS 동영상 선택이 실패되었습니다. 고객센터로 문의해주시기 바랍니다.');
                    }
                }
            },
            changedFile: function(contentType, event) {
                this.handleFileUploads(contentType, event.currentTarget.files);
            },
            handleFileUploads: function(contType, fileList) {
                document.querySelector('body').classList.add('body-lock'); //body-lock 추가
                // var fileList = event.currentTarget.files;
                if (contType === 'image') {
                    if ((this.imgAttachedCnt + fileList.length) > this.imgMaxFile) {
                        alert('첨부파일 된 최대개수(' + this.imgMaxFile + '개)가 초과되었습니다.');
                        return false;
                    } else {
                        this.imgAttachedCnt += fileList.length;
                    }
                } else {
                    if ((this.movAttachedCnt + fileList.length) > this.movMaxFile) {
                        alert('첨부파일 된 최대개수(' + this.movMaxFile +'개)가 초과되었습니다.');
                        return false;
                    } else {
                        this.movAttachedCnt += fileList.length;
                    }
                }

                var that = this;
                var cnt = 0;
                for (var idx = 0; idx < fileList.length; idx++) {
                    (function() {
                        var file = {
                            contFile: fileList.item(idx),
                            isImage: contType === 'image',
                            url: 'data:image/png;base64,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',
                            width: 0,
                            height: 0
                        };

                        that.readFileUrl(file, function(fileUrl, width, height) {
                            cnt++;
                            file.url = fileUrl;
                            file.width = width;
                            file.height = height;

                            that.files.push(file);

                            console.log("chiildaaadd files === " ,that.files + " /// " + that.files.length);
                            that.$emit('attach', that.files);

                            if (cnt >= fileList.length) {
                                console.log("all file changed");
                                document.querySelector('body').classList.remove('body-lock'); //body-lock 삭제
                                StyleCommon.checkEmphasisBtnBx(); //emphasis-btn-bx check
                            }
                        });
                    })();
                }
            },
            readFileUrl: function(file, callback) {
                var _URL = window.URL || window.webkitURL;
                if (file.isImage) {
                    var img = new Image();
                    var objectUrl = _URL.createObjectURL(file.contFile);
                    img.onload = function() {
                        callback(objectUrl, this.width, this.height);
                    }
                    img.src = objectUrl;
                } else {
                    var reader = new FileReader();
                    reader.onload = function(){
                        var blob = new Blob([reader.result], {type: file.contFile.type});
                        var url = _URL.createObjectURL(blob);
                        var video = document.createElement('video');
                        var timeupdate = function() {
                            if (snapImage()) {
                                video.removeEventListener('timeupdate', timeupdate);
                                video.pause();
                            }
                        };
                        video.addEventListener('loadeddata', function() {
                            if (snapImage()) {
                                video.removeEventListener('timeupdate', timeupdate);
                            }
                        });
                        var snapImage = function() {
                            var canvas = document.createElement('canvas');
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                            var image = canvas.toDataURL();
                            var success = image.length > 100000;
                            if (success) {
                                callback(image, video.videoWidth, video.videoHeight);
                                _URL.revokeObjectURL(url);
                            }
                            return success;
                        };
                        video.addEventListener('timeupdate', timeupdate);
                        video.preload = 'metadata';
                        video.src = url;

                        // Load video in Safari / IE11
                        video.muted = true;
                        video.playsInline = true;
                        video.play();
                    };
                    reader.readAsArrayBuffer(file.contFile);
                }
            },
            removeFile: function(idx) {
                if (this.files.length <= idx) return;

                if (this.files[idx].isImage) {
                    this.imgAttachedCnt -= 1;
                } else {
                    this.movAttachedCnt -= 1;
                }
                
                this.files.splice(idx, 1);
                if(this.files.length == 0 ){
                    StyleCommon.checkEmphasisBtnBx(); //emphasis-btn-bx check
                }
                this.$emit('attach', this.files);
            }
        },
        computed: {
            imgAttachDisable: function() {
                return this.imgAttachedCnt >= this.imgMaxFile;
            },
            movAttachDisable: function() {
                return this.movAttachedCnt >= this.movMaxFile;
            },
            isIosApp: isIosApp
        }
    };
</script>

<style></style>
