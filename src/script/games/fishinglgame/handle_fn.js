import { toast } from '@/script/toast';
import { sleep } from '@/utils/time';
import { getFishers } from './table_row';
import { Bait } from './transact/bait';
import Tools from './transact/tools';
import { getUseBaits } from './util';

/**
 * 工具处理
 * @param {*} rows
 */
export async function tools(rows) {
  toast('执行工具操作.');
  const tools = new Tools(rows);
  const fishersRet = await getFishers();
  if (fishersRet.rows.length) {
    const mineRet = await tools.mine(fishersRet.rows[0].asset_id);
    if (!mineRet.success) {
      toast('执行失败！');
      console.log('执行失败！', mineRet);
      if (mineRet.message.includes('You must install the bait')) {
        await stakeBait();
      }
      // .then((res) => {
      //   if (!res.success) {
      //     // 需要安装鱼饵
      //     if (res.message.includes('You must install the bait')) {
      //       toast('安装鱼饵。。。');
      //     }
      //   }
      // });
    }
  }
  // tools.mine();
}

/**
 * 安装鱼饵
 */
export async function stakeBait() {
  toast('安装鱼饵。。。');
  const { useBaitAmount, useBaitId } = window.gamesConfig.fishing;
  let useBaits = await getUseBaits(useBaitId, useBaitAmount);
  const bait = new Bait();
  console.log(useBaits, 'baits');
  // 没有鱼饵了 需要购买
  if (!useBaits || !useBaits.amount) {
    await buyBait();
    await sleep(2000);
    useBaits = await getUseBaits(useBaitId, useBaitAmount);
  }
  if (useBaits && useBaits.amount) {
    toast(`使用鱼饵: id: ${useBaits.id}, amount: ${useBaits.amount}`);
    await bait.stake(useBaits.amount, useBaits.id);
  }
}

/**
 * 购买鱼饵
 */
export function buyBait() {
  toast('购买鱼饵。。');
  const { buyBaitId, buyBaitAmount } = window.gamesConfig.fishing;
  const bait = new Bait();
  return bait.buy(Number(buyBaitAmount), buyBaitId);
}
