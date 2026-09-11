import type { ImgKey } from './images.js';
export type Gender = 'men' | 'women' | 'unisex';
export type CatalogGroup = { cat:string; coll:string; gender:Gender; imageKeys:ImgKey[]; items:Array<[string,string]> };
export const CATALOG: CatalogGroup[] = [
  { cat:'women-dresses', coll:'occasion', gender:'women', imageKeys:['dress1','dress2','dress3','dress4','dress5'], items:[
    ['Noir Column Dress','فستان نوار طويل'],['Silk Slip Dress','فستان سليب حريري'],['Satin Midi Dress','فستان ميدي ساتان'],['Pleated Day Dress','فستان يومي بكسرات'],['Linen Resort Dress','فستان كتان ريزورت'],['Velvet Evening Dress','فستان سهرة مخملي'],['Wrap Midi Dress','فستان ميدي بربطة'],['Floral Maxi Dress','فستان ماكسي مزهر'],['Tailored Shirt Dress','فستان قميص أنيق'],['Soft Knit Dress','فستان تريكو ناعم'],
  ]},
  { cat:'women-tops', coll:'essentials', gender:'women', imageKeys:['top1','top2','top3','top4','top5'], items:[
    ['Silk Blouse','بلوزة حرير'],['Ribbed Crop Top','توب قصير مضلع'],['Cashmere Knit Top','توب كشمير'],['Satin Cowl Top','توب ساتان'],['Poplin Shirt','قميص بوبلين'],['Relaxed Linen Shirt','قميص كتان واسع'],['Ribbed Long Sleeve','بلوزة طويلة مضلعة'],['Pleated Blouse','بلوزة بكسرات'],['Soft Jersey Tee','تيشيرت جيرسي ناعم'],['Statement Sleeve Top','توب بأكمام مميزة'],
  ]},
  { cat:'women-bottoms', coll:'essentials', gender:'women', imageKeys:['trouser2','trouser3','trouser5','top3','detail4'], items:[
    ['Tailored Wide Trousers','بنطلون واسع مفصل'],['High-Waist Trousers','بنطلون خصر عالٍ'],['Relaxed Chino','بنطلون تشينو واسع'],['Satin Wide Pants','بنطلون ساتان واسع'],['Pleated Trousers','بنطلون بكسرات'],['Linen Straight Pants','بنطلون كتان مستقيم'],['Midi Slip Skirt','تنورة ميدي ساتان'],['Pleated Midi Skirt','تنورة ميدي بكسرات'],['Denim Straight Jeans','جينز مستقيم'],['A-Line Mini Skirt','تنورة قصيرة بقصة A'],
  ]},
  { cat:'women-outerwear', coll:'new-season', gender:'women', imageKeys:['outer1','outer2','outer3','outer4','outer5'], items:[
    ['Wool Wrap Coat','معطف صوف ملتف'],['Classic Trench Coat','معطف ترينش كلاسيكي'],['Leather Biker Jacket','جاكيت جلد بايكر'],['Minimal Blazer','بليزر بسيط'],['Soft Belted Coat','معطف بحزام'],['Cropped Jacket','جاكيت قصير'],['Quilted Light Jacket','جاكيت مبطن خفيف'],['Double-Breasted Coat','معطف مزدوج الأزرار'],['Suede Overshirt Jacket','جاكيت شمواه'],['Longline Blazer','بليزر طويل'],
  ]},
  { cat:'men-shirts', coll:'essentials', gender:'men', imageKeys:['shirt1','shirt2','shirt3','shirt4','shirt5'], items:[
    ['Oxford Button Shirt','قميص أكسفورد'],['Premium Silk Shirt','قميص حرير فاخر'],['Linen Resort Shirt','قميص كتان ريزورت'],['Classic Formal Shirt','قميص رسمي كلاسيكي'],['Relaxed Overshirt','قميص علوي واسع'],['Essential Polo Shirt','تيشيرت بولو أساسي'],['Textured Knit Polo','بولو تريكو'],['Striped Cotton Shirt','قميص قطني مخطط'],['Mandarin Collar Shirt','قميص بياقة صينية'],['Heavyweight Tee','تيشيرت قطني ثقيل'],
  ]},
  { cat:'men-bottoms', coll:'essentials', gender:'men', imageKeys:['trouser1','trouser2','trouser3','trouser4','trouser5'], items:[
    ['Tailored Wool Trousers','بنطلون صوف مفصل'],['Relaxed Wide Trousers','بنطلون واسع مريح'],['Classic Chino Pants','بنطلون تشينو كلاسيكي'],['Tuxedo Trousers','بنطلون توكسيدو'],['Resort Linen Trousers','بنطلون كتان ريزورت'],['Straight Denim Jeans','جينز مستقيم'],['Slim Dark Jeans','جينز داكن سليم'],['Cargo Utility Pants','بنطلون كارغو عملي'],['Pleated Dress Trousers','بنطلون رسمي بكسرات'],['Cotton Drawstring Pants','بنطلون قطني برباط'],
  ]},
  { cat:'men-outerwear', coll:'new-season', gender:'men', imageKeys:['menOuter1','menOuter2','menOuter3','menOuter4','menOuter5'], items:[
    ['Classic Overcoat','معطف كلاسيكي'],['Field Utility Jacket','جاكيت ميداني'],['Minimal Bomber Jacket','جاكيت بومبر بسيط'],['Cashmere Blazer','بليزر كشمير'],['Dinner Jacket','جاكيت سهرة'],['Wool Peacoat','معطف صوف قصير'],['Technical Shell Jacket','جاكيت تقني'],['Corduroy Overshirt','قميص جاكيت مخملي'],['Quilted Jacket','جاكيت مبطن'],['Relaxed Tailored Blazer','بليزر مفصل بقصة مريحة'],
  ]},
  { cat:'kids-clothing', coll:'kids', gender:'unisex', imageKeys:['dress3','top1','top2','outer2','outer5'], items:[
    ['Everyday Cotton Set','طقم قطني يومي'],['Soft Jersey T-Shirt','تيشيرت جيرسي ناعم'],['Mini Oxford Shirt','قميص أكسفورد للأطفال'],['Lightweight Hoodie','هودي خفيف'],['Cozy Knit Cardigan','كارديجان تريكو دافئ'],['Relaxed Cargo Pants','بنطلون كارغو مريح'],['Pleated Party Dress','فستان حفلات بكسرات'],['Denim Dungarees','أفرول جينز'],['Rain Ready Jacket','جاكيت مقاوم للمطر'],['Weekend Tracksuit','تريننج عطلة نهاية الأسبوع'],
  ]},
  { cat:'sportswear', coll:'active', gender:'unisex', imageKeys:['shoe3','shoe4','trouser2','top2','menOuter2'], items:[
    ['Performance Running Tee','تيشيرت جري للأداء'],['Flex Training Shorts','شورت تدريب مرن'],['Lightweight Training Pants','بنطلون تدريب خفيف'],['Essential Sports Bra','حمالة رياضية أساسية'],['Performance Leggings','ليجنز رياضي'],['Running Windbreaker','جاكيت جري خفيف'],['Studio Yoga Top','توب يوجا'],['Recovery Joggers','بنطلون جوجر للاستشفاء'],['Training Hoodie','هودي تدريب'],['Court Performance Polo','بولو رياضي للملاعب'],
  ]},
  { cat:'accessories', coll:'accessories', gender:'unisex', imageKeys:['acc1','acc2','acc3','acc4','acc5'], items:[
    ['Structured Mini Bag','حقيبة صغيرة منظمة'],['Silk Square Scarf','وشاح حرير مربع'],['Classic Leather Belt','حزام جلد كلاسيكي'],['Minimal Cuff Bracelet','سوار بسيط'],['Cashmere Scarf','وشاح كشمير'],['Leather Crossbody Bag','حقيبة كروس بودي جلد'],['Slim Card Holder','حافظة بطاقات نحيفة'],['Classic Sunglasses','نظارة شمسية كلاسيكية'],['Leather Wallet','محفظة جلد'],['Everyday Cap','كاب يومي'],
  ]},
  { cat:'footwear', coll:'weekend', gender:'unisex', imageKeys:['shoe1','shoe2','shoe3','shoe4','shoe5'], items:[
    ['Sculptural Heels','كعب بتصميم نحتي'],['Classic Derby Shoes','حذاء ديربي كلاسيكي'],['Leather Sneakers','سنيكرز جلد'],['Everyday Running Shoes','حذاء جري يومي'],['Chelsea Boots','بوت تشيلسي'],['Satin Pumps','حذاء ساتان بكعب'],['Minimal Court Sneakers','سنيكرز رياضي بسيط'],['Suede Loafers','لوفر شمواه'],['Lace-Up Ankle Boots','بوت قصير برباط'],['Canvas Weekend Sneakers','سنيكرز كانفاس'],
  ]},
  { cat:'bags', coll:'accessories', gender:'unisex', imageKeys:['acc1','acc4','acc5','detail2','detail4'], items:[
    ['Soft Leather Tote','حقيبة توت جلد ناعمة'],['Compact Crossbody','حقيبة كروس بودي صغيرة'],['Structured Shoulder Bag','حقيبة كتف منظمة'],['Weekend Duffle Bag','حقيبة سفر نهاية الأسبوع'],['Mini Top Handle Bag','حقيبة يد صغيرة'],['Leather Hobo Bag','حقيبة هوبو جلد'],['Canvas Shopper','حقيبة تسوق كانفاس'],['Evening Clutch','كلتش سهرة'],['Travel Organizer Bag','حقيبة تنظيم للسفر'],['Everyday Bucket Bag','حقيبة باكيت يومية'],
  ]},
];
export const CAT_META: Record<string,{en:string;ar:string;order:number}> = {
  'women-dresses':{en:'Women Dresses',ar:'فساتين نسائية',order:1},'women-tops':{en:'Women Tops & Shirts',ar:'بلوزات وقمصان نسائية',order:2},'women-bottoms':{en:'Women Trousers & Skirts',ar:'بناطيل وتنانير نسائية',order:3},'women-outerwear':{en:'Women Outerwear',ar:'معاطف وجاكيتات نسائية',order:4},'men-shirts':{en:'Men Shirts & Polos',ar:'قمصان وبولو رجالية',order:5},'men-bottoms':{en:'Men Trousers & Jeans',ar:'بناطيل وجينز رجالي',order:6},'men-outerwear':{en:'Men Jackets & Coats',ar:'جاكيتات ومعاطف رجالية',order:7},'kids-clothing':{en:'Kids Collection',ar:'ملابس الأطفال',order:8},'sportswear':{en:'Active & Sportswear',ar:'ملابس رياضية',order:9},'accessories':{en:'Fashion Accessories',ar:'إكسسوارات الموضة',order:10},'footwear':{en:'Footwear',ar:'الأحذية',order:11},'bags':{en:'Bags',ar:'الحقائب',order:12},
};
export const COL_META = [
  {slug:'new-season',en:'New Season',ar:'الموسم الجديد',featured:true,image:'outer2' as ImgKey,descEn:'Fresh silhouettes and elevated new-season essentials.',descAr:'تصاميم جديدة وقطع أساسية راقية للموسم.'},
  {slug:'essentials',en:'Everyday Essentials',ar:'أساسيات يومية',featured:true,image:'shirt1' as ImgKey,descEn:'Refined everyday pieces built for effortless styling.',descAr:'قطع يومية أنيقة وسهلة التنسيق.'},
  {slug:'active',en:'Active Motion',ar:'الحركة والنشاط',featured:true,image:'shoe3' as ImgKey,descEn:'Performance-led pieces for training, running, and movement.',descAr:'قطع رياضية للأداء والتدريب والحركة.'},
  {slug:'kids',en:'Kids Edit',ar:'اختيارات الأطفال',featured:true,image:'top1' as ImgKey,descEn:'Comfortable and polished styles for younger wardrobes.',descAr:'اختيارات مريحة وأنيقة لخزانة الأطفال.'},
  {slug:'occasion',en:'Occasion Edit',ar:'إطلالات المناسبات',featured:true,image:'dress1' as ImgKey,descEn:'Elegant pieces for evenings, celebrations, and special moments.',descAr:'قطع أنيقة للمساء والمناسبات واللحظات الخاصة.'},
  {slug:'weekend',en:'Weekend',ar:'عطلة نهاية الأسبوع',featured:true,image:'shoe4' as ImgKey,descEn:'Relaxed pieces for modern weekends and off-duty days.',descAr:'قطع مريحة لعطلات نهاية الأسبوع والأيام غير الرسمية.'},
  {slug:'accessories',en:'Accessories Edit',ar:'مجموعة الإكسسوارات',featured:true,image:'acc1' as ImgKey,descEn:'Finishing pieces that complete every FIVE look.',descAr:'إكسسوارات تكمل إطلالات FIVE.'},
] as const;
