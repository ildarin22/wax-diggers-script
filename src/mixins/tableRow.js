import { obser } from '@/store/light.js';
export default {
  data() {
    return {
      obser
    };
  },
  methods: {
    // 获取参数
    getRowProp(template_id) {
      return this.obser.allProp.find((item) => item.template_id == template_id);
    },

    /**
     * 发送消息
     * @param {any} msg 消息
     */
    sendMessage(msg) {
      const { waxConfig } = this.obser;
      // if (!waxConfig.isOpen) return;
      const data = { __script: true, ...msg, waxConfig: { ...waxConfig } };
      console.log('send message....', data);
      try {
        window.postMessage(data, '*');
      } catch (error) {}
      if (window.parent !== window.self) {
        window.parent.postMessage(data, '*');
        return;
      }
    }
  }
};