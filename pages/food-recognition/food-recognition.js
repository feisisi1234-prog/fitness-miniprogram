// pages/food-recognition/food-recognition.js
const app = getApp()

Page({
  data: {
    selectedImage: null,
    isRecognizing: false,
    recognitionResult: null,
    showResult: false
  },

  onLoad() {
    console.log('食物识别页面加载');
  },

  // 选择图片
  chooseImage() {
    const that = this;
    
    wx.showActionSheet({
      itemList: ['拍照', '从相册选择'],
      success: (res) => {
        const sourceType = res.tapIndex === 0 ? ['camera'] : ['album'];
        
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: sourceType,
          success: (res) => {
            const tempFilePath = res.tempFilePaths[0];
            console.log('选择的图片:', tempFilePath);
            
            that.setData({
              selectedImage: tempFilePath,
              showResult: false,
              recognitionResult: null
            });
          },
          fail: (err) => {
            console.error('选择图片失败:', err);
            wx.showToast({
              title: '选择图片失败',
              icon: 'error'
            });
          }
        });
      }
    });
  },

  // 开始识别
  startRecognition() {
    if (!this.data.selectedImage) {
      wx.showToast({
        title: '请先选择图片',
        icon: 'none'
      });
      return;
    }

    console.log('========================================');
    console.log('🚀 [性能监控] 食物识别流程开始');
    console.log('========================================');
    const flowStartTime = Date.now();

    this.setData({
      isRecognizing: true
    });

    // 步骤1: 上传文件
    this.uploadFile(this.data.selectedImage)
      .then(fileId => {
        const uploadTime = Date.now() - flowStartTime;
        console.log(`✅ [性能监控] 步骤1完成: 文件上传耗时 ${uploadTime}ms`);
        console.log('文件ID:', fileId);
        
        // 步骤2: 创建 Chat 请求
        const chatStartTime = Date.now();
        return this.createChat(fileId).then(result => {
          const chatTime = Date.now() - chatStartTime;
          console.log(`✅ [性能监控] 步骤2完成: Chat请求耗时 ${chatTime}ms`);
          return result;
        });
      })
      .then(result => {
        const totalTime = Date.now() - flowStartTime;
        console.log('========================================');
        console.log(`🎉 [性能监控] 完整识别流程总耗时: ${totalTime}ms (${(totalTime/1000).toFixed(2)}秒)`);
        console.log('========================================');
        
        this.setData({
          isRecognizing: false,
          recognitionResult: result,
          showResult: true
        });
      })
      .catch(err => {
        const totalTime = Date.now() - flowStartTime;
        console.error(`❌ [性能监控] 识别失败，总耗时: ${totalTime}ms`);
        console.error('识别失败:', err);
        
        this.setData({
          isRecognizing: false
        });
        
        wx.showModal({
          title: '识别失败',
          content: err.message || '请稍后重试',
          showCancel: false
        });
      });
  },

  // 上传文件到 Coze
  uploadFile(filePath) {
    console.log('⏱️  [性能监控] 步骤1: 开始上传文件');
    console.log('文件路径:', filePath);
    console.log('上传 URL:', 'https://api.coze.cn/v1/files/upload');
    const uploadStartTime = Date.now();
    
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: 'https://api.coze.cn/v1/files/upload',
        filePath: filePath,
        name: 'file',
        header: {
          'Authorization': 'Bearer pat_baRz80DFMNvfXdgrzVTSLdaVJ6uSZ1nk4MQB6vaEi93O65O07AsDVN0ujjnrVeLA',
          'Content-Type': 'multipart/form-data'
        },
        success: (res) => {
          const uploadTime = Date.now() - uploadStartTime;
          console.log(`文件上传响应耗时: ${uploadTime}ms`);
          console.log('上传响应:', res);
          
          if (res.statusCode === 200) {
            try {
              const data = JSON.parse(res.data);
              console.log('解析后的数据:', data);
              if (data.code === 0 && data.data && data.data.id) {
                resolve(data.data.id);
              } else {
                console.error('上传失败，返回数据:', data);
                reject(new Error('文件上传失败: ' + (data.msg || data.message || '未知错误')));
              }
            } catch (err) {
              console.error('解析响应失败:', err);
              console.error('原始响应:', res.data);
              reject(new Error('解析响应失败'));
            }
          } else {
            console.error('HTTP 错误:', res.statusCode);
            console.error('响应内容:', res);
            reject(new Error('文件上传失败: HTTP ' + res.statusCode));
          }
        },
        fail: (err) => {
          const uploadTime = Date.now() - uploadStartTime;
          console.error(`文件上传失败耗时: ${uploadTime}ms`);
          console.error('上传失败详情:', err);
          console.error('错误信息:', err.errMsg);
          reject(new Error('网络请求失败: ' + (err.errMsg || '未知错误')));
        }
      });
    });
  },

  // 创建 Chat 并轮询结果
  createChat(fileId) {
    console.log('⏱️  [性能监控] 步骤2: 开始创建Chat请求');
    const chatStartTime = Date.now();
    
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://api.coze.cn/v3/chat',
        method: 'POST',
        header: {
          'Authorization': 'Bearer pat_baRz80DFMNvfXdgrzVTSLdaVJ6uSZ1nk4MQB6vaEi93O65O07AsDVN0ujjnrVeLA',
          'Content-Type': 'application/json'
        },
        data: {
          bot_id: '7610346096216342562',
          user_id: 'user_' + Date.now(),
          stream: false,
          auto_save_history: true,
          additional_messages: [
            {
              role: 'user',
              content: '请识别这个食物的名称、热量、升糖指数、升糖负荷，并给出食用建议',
              content_type: 'text'
            },
            {
              role: 'user',
              content: JSON.stringify([{
                type: 'file',
                file_id: fileId
              }]),
              content_type: 'object_string'
            }
          ]
        },
        success: (res) => {
          const requestTime = Date.now() - chatStartTime;
          console.log(`Chat请求响应耗时: ${requestTime}ms`);
          console.log('完整响应:', JSON.stringify(res.data));
          
          if (res.statusCode === 200 && res.data.code === 0) {
            const chatId = res.data.data.id;
            const conversationId = res.data.data.conversation_id;
            
            console.log('Chat ID:', chatId);
            console.log('Conversation ID:', conversationId);
            
            // 开始轮询消息
            this.pollMessages(conversationId, chatId, chatStartTime)
              .then(resolve)
              .catch(reject);
          } else {
            console.error('Chat请求失败，完整错误:', res.data);
            reject(new Error('Chat请求失败: ' + (res.data.msg || res.data.error_message || '未知错误')));
          }
        },
        fail: (err) => {
          const requestTime = Date.now() - chatStartTime;
          console.error(`Chat请求失败耗时: ${requestTime}ms`);
          reject(new Error('网络请求失败'));
        }
      });
    });
  },

  // 轮询消息
  pollMessages(conversationId, chatId, chatStartTime, retryCount = 0) {
    console.log(`⏱️  [性能监控] 步骤3: 轮询消息 (第${retryCount + 1}次)`);
    const pollStartTime = Date.now();
    
    return new Promise((resolve, reject) => {
      if (retryCount > 60) {
        reject(new Error('识别超时，请重试'));
        return;
      }

      wx.request({
        url: 'https://api.coze.cn/v3/chat/message/list',
        method: 'GET',
        header: {
          'Authorization': 'Bearer pat_baRz80DFMNvfXdgrzVTSLdaVJ6uSZ1nk4MQB6vaEi93O65O07AsDVN0ujjnrVeLA',
        },
        data: {
          conversation_id: conversationId,
          chat_id: chatId
        },
        success: (res) => {
          const pollTime = Date.now() - pollStartTime;
          console.log(`轮询响应耗时: ${pollTime}ms`);
          console.log(`收到消息数量: ${res.data.data ? res.data.data.length : 0}`);
          
          if (res.statusCode === 200 && res.data.code === 0) {
            const messages = res.data.data || [];
            
            // 打印所有消息用于调试
            messages.forEach((msg, index) => {
              console.log(`消息${index + 1}: role=${msg.role}, type=${msg.type}, content=${msg.content ? msg.content.substring(0, 100) : 'null'}`);
            });
            
            // 查找 assistant 的回复
            const assistantMessage = messages.find(msg => 
              msg.role === 'assistant' && msg.type === 'answer'
            );
            
            if (assistantMessage && assistantMessage.content) {
              const totalPollTime = Date.now() - chatStartTime;
              console.log(`✅ [性能监控] 步骤3完成: 消息轮询总耗时 ${totalPollTime}ms (轮询${retryCount + 1}次)`);
              
              // 解析结果
              const result = this.parseRecognitionResult(assistantMessage.content);
              resolve(result);
            } else {
              // 继续轮询
              console.log(`未找到assistant回复，${retryCount < 60 ? '继续轮询' : '即将超时'}`);
              setTimeout(() => {
                this.pollMessages(conversationId, chatId, chatStartTime, retryCount + 1)
                  .then(resolve)
                  .catch(reject);
              }, 1000); // 每秒轮询一次
            }
          } else {
            console.error('轮询失败，响应:', res.data);
            reject(new Error('消息轮询失败: ' + (res.data.msg || '未知错误')));
          }
        },
        fail: (err) => {
          const pollTime = Date.now() - pollStartTime;
          console.error(`轮询请求失败耗时: ${pollTime}ms`, err);
          reject(new Error('网络请求失败'));
        }
      });
    });
  },

  // 解析识别结果
  parseRecognitionResult(content) {
    console.log('解析识别结果:', content);
    
    // 这里需要根据实际的 Coze 返回格式进行解析
    // 假设返回的是 JSON 格式或结构化文本
    try {
      // 尝试解析 JSON
      if (content.includes('{') && content.includes('}')) {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const data = JSON.parse(jsonMatch[0]);
          return {
            name: data.name || data.食物名称 || '未知食物',
            calories: data.calories || data.热量 || '未知',
            gi: data.gi || data.升糖指数 || '未知',
            gl: data.gl || data.升糖负荷 || '未知',
            suggestion: data.suggestion || data.食用建议 || '暂无建议'
          };
        }
      }
      
      // 文本解析
      const result = {
        name: '未知食物',
        calories: '未知',
        gi: '未知',
        gl: '未知',
        suggestion: '暂无建议'
      };
      
      // 提取食物名称
      const nameMatch = content.match(/(?:食物名称|名称)[：:]\s*([^\n]+)/i);
      if (nameMatch) result.name = nameMatch[1].trim();
      
      // 提取热量
      const caloriesMatch = content.match(/(?:热量)[：:]\s*([^\n]+)/i);
      if (caloriesMatch) result.calories = caloriesMatch[1].trim();
      
      // 提取升糖指数
      const giMatch = content.match(/(?:升糖指数|GI)[（(]?[GI]*[)）]?[：:]\s*(\d+)/i);
      if (giMatch) result.gi = giMatch[1].trim();
      
      // 提取升糖负荷
      const glMatch = content.match(/(?:升糖负荷|GL)[（(]?[GL]*[)）]?[：:]\s*(\d+)/i);
      if (glMatch) result.gl = glMatch[1].trim();
      
      // 提取食用建议
      const suggestionMatch = content.match(/(?:食用建议|建议)[：:]\s*([\s\S]+?)(?:\n\n|$)/i);
      if (suggestionMatch) result.suggestion = suggestionMatch[1].trim();
      
      return result;
    } catch (err) {
      console.error('解析结果失败:', err);
      return {
        name: '解析失败',
        calories: '请查看原始内容',
        gi: '-',
        gl: '-',
        suggestion: content
      };
    }
  },

  // 重新识别
  resetRecognition() {
    this.setData({
      selectedImage: null,
      recognitionResult: null,
      showResult: false
    });
  }
})
