import { getRandomNumber } from './getRandomNumber'

const avatars = [
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762812/guessThePrice/avatars/bear_hoajvn.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762812/guessThePrice/avatars/buffalo_h2ax1j.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762812/guessThePrice/avatars/chick_wjoaix.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762812/guessThePrice/avatars/chicken_pkcudc.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762812/guessThePrice/avatars/cow_shndy5.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762812/guessThePrice/avatars/crocodile_te0sfv.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762812/guessThePrice/avatars/dog_eo1g8d.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762812/guessThePrice/avatars/duck_tzfkwh.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762812/guessThePrice/avatars/elephant_bfspjz.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762812/guessThePrice/avatars/frog_sqcbyt.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762813/guessThePrice/avatars/giraffe_lsalfg.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762812/guessThePrice/avatars/goat_iwhget.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762813/guessThePrice/avatars/gorilla_h2cd3m.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762813/guessThePrice/avatars/hippo_qh1q7n.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762813/guessThePrice/avatars/horse_lcroff.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762813/guessThePrice/avatars/monkey_czuq3z.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762813/guessThePrice/avatars/moose_puhuq7.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762813/guessThePrice/avatars/narwhal_ygl3ma.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762813/guessThePrice/avatars/owl_wtuye8.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762813/guessThePrice/avatars/panda_clqwux.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762813/guessThePrice/avatars/parrot_v0ml0c.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762813/guessThePrice/avatars/penguin_k9mq5w.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762814/guessThePrice/avatars/pig_a01w7h.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762814/guessThePrice/avatars/rabbit_cqgeya.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762814/guessThePrice/avatars/rhino_wxzroh.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762814/guessThePrice/avatars/sloth_ybmeza.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762814/guessThePrice/avatars/snake_o125aa.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762814/guessThePrice/avatars/walrus_iu64ps.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762814/guessThePrice/avatars/whale_cgvzkk.png',
  'http://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1614762814/guessThePrice/avatars/zebra_ru3jbt.png'
]

export const getAvatar = (id: string) => {
  if (id === 'dummy')
    return 'https://res.cloudinary.com/kana/image/upload/f_auto,q_auto/v1616085103/guessThePrice/default_xmr80h.jpg'
  return avatars[getRandomNumber(0, avatars.length - 1)]
}
