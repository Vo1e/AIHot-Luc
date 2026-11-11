// 这个行业（荷比卢家用网通与电商）的分类体系：类别、标签词表、公司（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉结构抽取模型这一类收什么、
 * 和相邻类别的边界在哪（总的归类原则写在 prompts/structure.md 里）。
 * commentary 标出评论类（教程、观点）：日报写过的事又有评论类的后续报道，只占一行快讯（报道它的信源够多时除外）。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 * tagColor 是飞书推送卡片里跟在标题后面的这一类小标签的颜色（飞书 text_tag 的颜色名）。
 * feedLabel 是分类 RSS 标题里的名字（不写就用 label）。公开接口、RSS 和 MCP 里要把一类并进另一类发布，写在站点设置里（site/site.ts 的 PUBLIC_CATEGORIES）。
 */
export const CATEGORIES = [
  { key: "products", tagColor: "indigo", label: "产品", feedLabel: "产品与技术", section: "新品与技术", guide: "家用与小型商用网络产品（路由器、Mesh、交换机、4G/5G CPE、电力猫、网卡）、智能家居（插座、照明、传感器、中枢）、安防摄像头、智能门铃与门锁、扫地机器人的发布、型号更新、固件功能、价格与上市地区，以及 Wi-Fi 与 Matter/Thread 标准、芯片平台和认证进展。产品评测也归这里；同一产品的渠道促销归渠道。" },
  { key: "channel", tagColor: "turquoise", label: "渠道", feedLabel: "渠道与电商", section: "渠道与电商", guide: "Amazon（Vendor/Seller Central、费用、广告、物流、Prime Day 与黑五）、bol、Coolblue、MediaMarkt 等零售与电商平台的规则、费用、促销和经营动作，运营商的路由器政策与套餐捆绑，分销与渠道合作。平台公司的财报和人事归行业。" },
  { key: "industry", tagColor: "orange", label: "行业", feedLabel: "行业与竞品", section: "行业与竞品", guide: "已发生的公司经营：财报、市场份额与销量数据、融资并购、人事、合作、诉讼、供应链与关税，以及竞品品牌的战略动作。新闻由当事人发帖、带有态度，也不因此变成观点。" },
  { key: "policy", tagColor: "violet", label: "政策", feedLabel: "政策与安全", section: "政策与安全", guide: "欧盟与荷比卢、美国等地对联网设备和电商的法规、监管调查、禁令与执法（RED 网络安全条款、CRA、GPSR、路由器自由、能效与回收），以及路由器、摄像头等设备的安全漏洞、召回和真实安全事故。" },
  { key: "tip", tagColor: "green", label: "实操", section: "实操与观点", guide: "读者可以照着做的方法：Amazon 运营与广告、Listing 与内容、零售和渠道实操、数据分析与 AI 工具在电商中的用法、网络部署与配置经验。重点是可复用的做法；单纯发布工具归渠道或产品，只有态度和预测而无做法归观点。", commentary: true },
  { key: "opinion", tagColor: "purple", label: "观点", section: "实操与观点", guide: "重点是作者的解释、判断、主张、预测、评论或访谈观点，比如对 Wi-Fi 换代节奏、电商平台走向、竞品打法的分析。讨论市场不自动归行业，作者是名人不自动归观点。", commentary: true },
] as const satisfies ReadonlyArray<{ key: string; tagColor: string; label: string; feedLabel?: string; section: string; guide: string; commentary?: true }>;

/**
 * 这个行业最受关注的一类发布（网通行业是新品）：日报报头的“N 款新品”、改分类后修订已出的报告都按它数。
 * category 是类别，tag 是标签，两者都对上才算；unit 接在数字后面。
 * 没有这样一类的行业设成 null，报头就不显示这个数。
 */
export const RELEASE: { category: string; tag: string; unit: string } | null = { category: "products", tag: "新品发布", unit: "款新品" };

/** 周报月报的总述可以直接写、不必在报道里找到出处的行业通用词（小写）。站名会自动算进去。 */
export const PLAIN_TERMS: readonly string[] = ["wi-fi", "wifi", "mesh", "isp", "eu", "ai", "5g", "ceo", "api", "b2b", "b2c"];

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = ["product_launch", "tech_update", "channel_move", "market_data", "industry_event", "policy_security", "opinion_analysis", "how_to"] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些“分类标签”之一。 */
export const CATEGORY_TAGS = [
  "新品发布", "产品更新", "技术/标准", "渠道/电商", "促销/价格", "市场/数据", "行业动态", "政策/监管", "安全/漏洞", "评测/对比", "实操/指南", "观点/访谈", "现象/趋势",
  "非本行业", "其他",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = [
  "Wi-Fi 7", "Wi-Fi 8", "Mesh", "路由器", "交换机/商用", "4G/5G", "宽带/光纤", "智能家居", "安防摄像头", "门铃/门锁", "扫地机器人", "Matter", "芯片",
  "Amazon 运营", "Amazon 广告", "零售渠道", "运营商", "大促", "AI 工具", "供应链/关税",
] as const;

/** 可选的实体标签（公司、机构、平台）。 */
export const ENTITY_TAGS = ["TP-Link", "Netgear", "ASUS", "AVM", "eero", "Ring", "eufy", "Philips Hue", "Amazon", "bol", "Coolblue", "MediaMarkt"] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  新品: "新品发布", 新产品: "新品发布", 发布: "新品发布", 上市: "新品发布", 产品发布: "新品发布",
  产品: "产品更新", 更新: "产品更新", 固件: "产品更新", 固件更新: "产品更新", 功能更新: "产品更新",
  技术: "技术/标准", 标准: "技术/标准", 认证: "技术/标准",
  电商: "渠道/电商", 渠道: "渠道/电商", 零售: "渠道/电商", 平台: "渠道/电商", 分销: "渠道/电商",
  促销: "促销/价格", 价格: "促销/价格", 折扣: "促销/价格", 降价: "促销/价格", 优惠: "促销/价格", deals: "促销/价格",
  市场: "市场/数据", 数据: "市场/数据", 财报: "市场/数据", 销量: "市场/数据", 份额: "市场/数据", 报告: "市场/数据", 研究: "市场/数据",
  公司动态: "行业动态", 合作: "行业动态", 融资: "行业动态", 收购: "行业动态", 并购: "行业动态", 投资: "行业动态", 人事: "行业动态", 行业: "行业动态", 动态: "行业动态",
  政策: "政策/监管", 监管: "政策/监管", 法规: "政策/监管", 合规: "政策/监管", 禁令: "政策/监管",
  安全: "安全/漏洞", 漏洞: "安全/漏洞", 网络安全: "安全/漏洞", 召回: "安全/漏洞",
  评测: "评测/对比", 测评: "评测/对比", 对比: "评测/对比", review: "评测/对比",
  教程: "实操/指南", 指南: "实操/指南", 实操: "实操/指南", 技巧: "实操/指南", 最佳实践: "实操/指南", 实践: "实操/指南",
  观点: "观点/访谈", 访谈: "观点/访谈", 评论: "观点/访谈", 趋势: "现象/趋势", 现象: "现象/趋势",
  非网通: "非本行业", 无关: "非本行业",
  wifi7: "Wi-Fi 7", "wifi 7": "Wi-Fi 7", "wi-fi7": "Wi-Fi 7", "802.11be": "Wi-Fi 7", wifi8: "Wi-Fi 8", "wifi 8": "Wi-Fi 8", "wi-fi8": "Wi-Fi 8", "802.11bn": "Wi-Fi 8",
  mesh: "Mesh", 网状网络: "Mesh", 组网: "Mesh", 路由: "路由器", router: "路由器", 交换机: "交换机/商用", 商用网络: "交换机/商用",
  "5g": "4G/5G", "4g": "4G/5G", cpe: "4G/5G", 宽带: "宽带/光纤", 光纤: "宽带/光纤", 摄像头: "安防摄像头", 监控: "安防摄像头",
  门铃: "门铃/门锁", 智能门铃: "门铃/门锁", 门锁: "门铃/门锁", 智能门锁: "门铃/门锁", doorbell: "门铃/门锁",
  扫地机: "扫地机器人", 扫拖机器人: "扫地机器人", 机器人吸尘器: "扫地机器人", robotstofzuiger: "扫地机器人", "robot vacuum": "扫地机器人",
  matter: "Matter", thread: "Matter", 智能插座: "智能家居", 智能照明: "智能家居", 智能灯: "智能家居",
  amazon广告: "Amazon 广告", 广告: "Amazon 广告", 运营商渠道: "运营商", isp: "运营商", 黑五: "大促", "prime day": "大促", 关税: "供应链/关税", 供应链: "供应链/关税",
};

// ── 公司与主体 ──────────────────────────────────────────────────────────────────────────

/**
 * 公司主题：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。
 * aliases 给结构抽取模型看；orgNames 是这家公司发消息时开头用的组织名（公司、实验室、团队），
 * 在它自己的主题页上读者知道说的是谁，可以省去；otherNames 是公司的其他称呼（官方账号名、子品牌）。
 * 所有这些名字都用来认出说的是哪家公司，比如把事实的主体对到发布方。
 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[]; orgNames?: string[]; otherNames?: string[] }> = {
  "tp-link": { name: "TP-Link", displayTag: "TP-Link", aliases: ["TP-Link", "Deco", "Archer", "Tapo", "Kasa", "VIGI", "Omada", "Mercusys", "普联"], orgNames: ["TP-Link", "TP-Link Systems", "普联"], otherNames: ["Mercusys", "Tapo", "Omada", "Kasa"] },
  netgear: { name: "Netgear", displayTag: "Netgear", aliases: ["Netgear", "NETGEAR", "Orbi", "Nighthawk"], orgNames: ["NETGEAR", "Netgear"] },
  asus: { name: "ASUS", displayTag: "ASUS", aliases: ["ASUS", "华硕", "ZenWiFi", "ROG Rapture"], orgNames: ["ASUS", "华硕"] },
  avm: { name: "AVM / FRITZ!", displayTag: "AVM", aliases: ["AVM", "FRITZ!", "FRITZ!Box", "FRITZ! / AVM"], orgNames: ["AVM", "FRITZ!"] },
  eero: { name: "eero", displayTag: "eero", aliases: ["eero", "Amazon eero"], orgNames: ["eero"] },
  linksys: { name: "Linksys", displayTag: null, aliases: ["Linksys", "Velop"], orgNames: ["Linksys"] },
  ubiquiti: { name: "Ubiquiti / UniFi", displayTag: null, aliases: ["Ubiquiti", "UniFi"], orgNames: ["Ubiquiti"] },
  devolo: { name: "devolo", displayTag: null, aliases: ["devolo"], orgNames: ["devolo"] },
  "google-nest": { name: "Google Nest Wifi", displayTag: null, aliases: ["Nest Wifi", "Google Wifi"], orgNames: ["Google Nest"] },
  huawei: { name: "Huawei", displayTag: null, aliases: ["Huawei", "华为"], orgNames: ["Huawei", "华为"] },
  xiaomi: { name: "Xiaomi", displayTag: null, aliases: ["Xiaomi", "小米"], orgNames: ["Xiaomi", "小米"] },
  zyxel: { name: "Zyxel", displayTag: null, aliases: ["Zyxel"], orgNames: ["Zyxel"] },
  "d-link": { name: "D-Link", displayTag: null, aliases: ["D-Link"], orgNames: ["D-Link"] },
  tenda: { name: "Tenda", displayTag: null, aliases: ["Tenda", "腾达"], orgNames: ["Tenda"] },
  ring: { name: "Ring", displayTag: "Ring", aliases: ["Ring", "Ring Doorbell", "Blink"], orgNames: ["Ring"], otherNames: ["Blink"] },
  eufy: { name: "eufy / Anker", displayTag: "eufy", aliases: ["eufy", "eufy Security", "Anker"], orgNames: ["eufy", "Anker"] },
  arlo: { name: "Arlo", displayTag: null, aliases: ["Arlo"], orgNames: ["Arlo"] },
  reolink: { name: "Reolink", displayTag: null, aliases: ["Reolink"], orgNames: ["Reolink"] },
  ezviz: { name: "EZVIZ", displayTag: null, aliases: ["EZVIZ", "萤石"], orgNames: ["EZVIZ"] },
  "google-home": { name: "Google Nest / Home", displayTag: null, aliases: ["Nest Cam", "Nest Doorbell", "Google Home"], orgNames: ["Google Nest", "Google Home"] },
  "philips-hue": { name: "Philips Hue / Signify", displayTag: "Philips Hue", aliases: ["Philips Hue", "Hue", "Signify", "WiZ"], orgNames: ["Philips Hue", "Signify"] },
  aqara: { name: "Aqara", displayTag: null, aliases: ["Aqara", "绿米"], orgNames: ["Aqara"] },
  ikea: { name: "IKEA Smart Home", displayTag: null, aliases: ["IKEA", "DIRIGERA", "宜家"], orgNames: ["IKEA"] },
  roborock: { name: "Roborock", displayTag: null, aliases: ["Roborock", "石头科技"], orgNames: ["Roborock"] },
  dreame: { name: "Dreame", displayTag: null, aliases: ["Dreame", "追觅"], orgNames: ["Dreame"] },
  ecovacs: { name: "Ecovacs", displayTag: null, aliases: ["Ecovacs", "Deebot", "科沃斯"], orgNames: ["Ecovacs"] },
  irobot: { name: "iRobot", displayTag: null, aliases: ["iRobot", "Roomba"], orgNames: ["iRobot"] },
  qualcomm: { name: "Qualcomm", displayTag: null, aliases: ["Qualcomm", "高通"], orgNames: ["Qualcomm", "高通"] },
  mediatek: { name: "MediaTek", displayTag: null, aliases: ["MediaTek", "联发科", "Filogic"], orgNames: ["MediaTek", "联发科"] },
  broadcom: { name: "Broadcom", displayTag: null, aliases: ["Broadcom", "博通"], orgNames: ["Broadcom", "博通"] },
  amazon: { name: "Amazon", displayTag: "Amazon", aliases: ["Amazon", "亚马逊", "Amazon.nl", "Amazon.com.be"], orgNames: ["Amazon", "亚马逊"], otherNames: ["Amazon Ads", "Seller Central", "Vendor Central"] },
  bol: { name: "bol", displayTag: "bol", aliases: ["bol", "bol.com"], orgNames: ["bol"] },
  coolblue: { name: "Coolblue", displayTag: "Coolblue", aliases: ["Coolblue"], orgNames: ["Coolblue"] },
  mediamarkt: { name: "MediaMarkt", displayTag: "MediaMarkt", aliases: ["MediaMarkt", "Media Markt", "Ceconomy"], orgNames: ["MediaMarkt", "Ceconomy"] },
  kpn: { name: "KPN", displayTag: null, aliases: ["KPN"], orgNames: ["KPN"] },
  odido: { name: "Odido", displayTag: null, aliases: ["Odido"], orgNames: ["Odido"] },
  vodafoneziggo: { name: "VodafoneZiggo", displayTag: null, aliases: ["VodafoneZiggo", "Ziggo"], orgNames: ["VodafoneZiggo", "Ziggo"] },
  proximus: { name: "Proximus", displayTag: null, aliases: ["Proximus"], orgNames: ["Proximus"] },
  telenet: { name: "Telenet", displayTag: null, aliases: ["Telenet"], orgNames: ["Telenet"] },
};

/**
 * 身份词典：摘要和标题里出现的公司，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 行业没有这个问题时可以留空数组。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [
  { id: "tp-link", name: "TP-Link", patterns: [/tp-?link|普联|\btapo\b|\bkasa\b|\bvigi\b|\bomada\b|mercusys/i, /\bdeco\s?(?:x|xe|be|m|s)\d/i, /\barcher\s?(?:be|ax|axe|gx|ge|c)?\s?\d/i] },
  { id: "netgear", name: "Netgear", patterns: [/netgear|\borbi\b|nighthawk/i] },
  { id: "asus", name: "ASUS", patterns: [/\basus\b|华硕|zenwifi|rog\s?rapture/i] },
  { id: "avm", name: "AVM / FRITZ!", patterns: [/\bAVM\b/, /fritz!|fritz\s?box/i] },
  { id: "eero", name: "eero", patterns: [/\beero\b/i] },
  { id: "linksys", name: "Linksys", patterns: [/linksys|\bvelop\b/i] },
  { id: "ubiquiti", name: "Ubiquiti", patterns: [/ubiquiti|\bunifi\b|amplifi/i] },
  { id: "devolo", name: "devolo", patterns: [/devolo/i] },
  { id: "google-nest", name: "Google Nest Wifi", patterns: [/nest\s?wi-?fi|google\s?wi-?fi/i] },
  { id: "huawei", name: "Huawei", patterns: [/huawei|华为/i] },
  { id: "xiaomi", name: "Xiaomi", patterns: [/xiaomi|小米/i] },
  { id: "zyxel", name: "Zyxel", patterns: [/zyxel/i] },
  { id: "d-link", name: "D-Link", patterns: [/\bd-?link\b/i] },
  { id: "tenda", name: "Tenda", patterns: [/\btenda\b|腾达/i] },
  { id: "ring", name: "Ring", patterns: [/\bRing\b/, /\bblink\s?(?:mini|outdoor|doorbell|camera)/i] },
  { id: "eufy", name: "eufy / Anker", patterns: [/\beufy\b|\banker\b/i] },
  { id: "arlo", name: "Arlo", patterns: [/\barlo\b/i] },
  { id: "reolink", name: "Reolink", patterns: [/reolink/i] },
  { id: "ezviz", name: "EZVIZ", patterns: [/ezviz|萤石/i] },
  { id: "google-home", name: "Google Nest / Home", patterns: [/nest\s?(?:cam|doorbell|hub)|google\s?home/i] },
  { id: "philips-hue", name: "Philips Hue / Signify", patterns: [/philips\s?hue|\bsignify\b/i, /\bHue\b/] },
  { id: "aqara", name: "Aqara", patterns: [/aqara|绿米/i] },
  { id: "ikea", name: "IKEA", patterns: [/\bikea\b|宜家|dirigera/i] },
  { id: "roborock", name: "Roborock", patterns: [/roborock|石头科技/i] },
  { id: "dreame", name: "Dreame", patterns: [/\bdreame\b|追觅/i] },
  { id: "ecovacs", name: "Ecovacs", patterns: [/ecovacs|\bdeebot\b|科沃斯/i] },
  { id: "irobot", name: "iRobot", patterns: [/irobot|\broomba\b/i] },
  { id: "qualcomm", name: "Qualcomm", patterns: [/qualcomm|高通/i] },
  { id: "mediatek", name: "MediaTek", patterns: [/mediatek|联发科|\bfilogic\b/i] },
  { id: "broadcom", name: "Broadcom", patterns: [/broadcom|博通/i] },
  { id: "amazon", name: "Amazon", patterns: [/amazon|亚马逊/i] },
  { id: "bol", name: "bol", patterns: [/\bbol(?:\.com)?\b/i] },
  { id: "coolblue", name: "Coolblue", patterns: [/coolblue/i] },
  { id: "mediamarkt", name: "MediaMarkt", patterns: [/media\s?markt|ceconomy/i] },
  { id: "kpn", name: "KPN", patterns: [/\bkpn\b/i] },
  { id: "odido", name: "Odido", patterns: [/\bodido\b/i] },
  { id: "vodafoneziggo", name: "VodafoneZiggo", patterns: [/vodafone\s?ziggo|\bziggo\b/i] },
  { id: "proximus", name: "Proximus", patterns: [/proximus/i] },
  { id: "telenet", name: "Telenet", patterns: [/telenet/i] },
];

/** 这些域名上的文章，发布方就是对应的公司（托管平台如 GitHub、arXiv 不算）。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "tp-link", domains: ["tp-link.com", "tapo.com", "omadanetworks.com", "mercusys.com"] },
  { entityId: "netgear", domains: ["netgear.com"] },
  { entityId: "asus", domains: ["asus.com"] },
  { entityId: "avm", domains: ["avm.de", "fritz.com"] },
  { entityId: "eero", domains: ["eero.com"] },
  { entityId: "linksys", domains: ["linksys.com"] },
  { entityId: "ubiquiti", domains: ["ui.com"] },
  { entityId: "devolo", domains: ["devolo.com", "devolo.nl", "devolo.de"] },
  { entityId: "ring", domains: ["ring.com"] },
  { entityId: "eufy", domains: ["eufy.com", "anker.com"] },
  { entityId: "arlo", domains: ["arlo.com"] },
  { entityId: "reolink", domains: ["reolink.com"] },
  { entityId: "philips-hue", domains: ["philips-hue.com", "signify.com"] },
  { entityId: "aqara", domains: ["aqara.com"] },
  { entityId: "roborock", domains: ["roborock.com"] },
  { entityId: "qualcomm", domains: ["qualcomm.com"] },
  { entityId: "mediatek", domains: ["mediatek.com"] },
  { entityId: "broadcom", domains: ["broadcom.com"] },
  { entityId: "amazon", domains: ["aboutamazon.com", "aboutamazon.eu", "sell.amazon.com"] },
  { entityId: "bol", domains: ["bol.com", "partnerplatform.bol.com"] },
  { entityId: "coolblue", domains: ["coolblue.nl", "coolblue.be"] },
  { entityId: "kpn", domains: ["kpn.com", "overons.kpn"] },
  { entityId: "odido", domains: ["odido.nl"] },
  { entityId: "vodafoneziggo", domains: ["vodafoneziggo.nl"] },
  { entityId: "proximus", domains: ["proximus.com", "proximus.be"] },
  { entityId: "telenet", domains: ["telenet.be"] },
];

/** 原文里的这些写法也算提到了对应公司。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [
  { entityId: "tp-link", pattern: /@TPLINK\w*\b/i },
  { entityId: "avm", pattern: /\bFRITZ\b/ },
];
