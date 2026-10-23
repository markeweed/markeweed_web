/* ==========================================================================
   MarkeWeed · i18n (ES / EN)
   - El HTML trae el español por defecto. Al iniciar se "cosecha" ese texto
     como diccionario ES, así no hay que duplicarlo aquí.
   - Atributos: data-i18n (texto), data-i18n-html (HTML), data-i18n-attr
     ("aria-label:clave;title:otra").
   - DICT.es solo contiene textos que genera JS (no están en el HTML).
   ========================================================================== */
(function () {
  "use strict";

  var DICT = {};

  DICT.es = {
    "meta.title": "MarkeWeed · Portfolio",
    "meta.desc": "Portfolio comercial de MarkeWeed: redes sociales, Google, fotografía, vídeo y diseño para clubs y asociaciones.",
    "a11y.closeMenu": "Cerrar menú",
    "stories.play": "Reproducir",
    "stories.live": "Story {n} de {total}: {label}",
    "spack.dow": "L,M,X,J,V,S,D",
    "spack.c8": "8 stories: unas dos por semana, para mantener el perfil vivo.",
    "spack.c22": "22 stories: casi una por cada día laborable del mes.",
    "spack.c32": "32 stories: presencia diaria, con refuerzo en días de evento.",
    "spack.c60": "+60 stories: dos o más al día. Máxima presencia, a medida.",
    "interest.general": "Información general",
    "interest.plan.inicio": "Plan Inicio (22 stories, 4 vídeos, 6 posts)",
    "interest.plan.clubsy": "Plan Clubsy (22 stories, 4 vídeos, 6 posts + web)",
    "interest.plan.weareclub": "Pack WeAreClub (32 stories, 6 vídeos, 8 posts)",
    "interest.service.design": "Servicio de diseño",
    "interest.service.photo": "Servicio de fotografía",
    "interest.service.video": "Servicio de vídeo",
    "interest.service.stories": "Paquete de Stories para Instagram",
    "interest.stories": "Paquete de Stories ({n} stories al mes)",
    "interest.storiesPlus": "Paquete de Stories (más de 60 stories al mes)",
    "interest.merch": "Diseño de merchandising",
    "interest.merchPiece": "Diseño de merchandising: {piece}",
    "interest.config": "{name}. Mi selección: {sel}",
    "summary": "Hola, he visto el portfolio de MarkeWeed y me interesa: {x}.",
    "modal.copied": "¡Copiado!",
    "modal.copiedLive": "Resumen copiado al portapapeles.",
    "modal.copyFail": "No se pudo copiar. Selecciona el mensaje y cópialo a mano.",
    "cfg.n.inicio": "Plan Inicio",
    "cfg.n.clubsy": "Plan Clubsy",
    "cfg.n.clubsyPlus": "Plan Clubsy + extras",
    "cfg.n.weareclub": "Pack WeAreClub",
    "cfg.n.custom": "Plan a medida",
    "cfg.n.individual": "Servicios individuales",
    "cfg.r.clubsy": "Quieres web propia: el Plan Clubsy incluye web a medida con solicitud de invitación automática, además de 22 stories, 4 vídeos y 6 posts al mes.",
    "cfg.r.clubsyPlus": "Clubsy + extras: pides web y más contenido del que incluye el plan. Lo concretas con tu contacto.",
    "cfg.r.weareclub": "Necesitas más volumen que el Plan Inicio: el Pack WeAreClub incluye 32 stories, 6 vídeos y 8 posts al mes.",
    "cfg.r.custom": "Tu selección supera el Pack WeAreClub. Plan a medida: consúltalo con tu contacto.",
    "cfg.r.individual": "Para algo puntual encajan mejor los servicios individuales (diseño, fotografía, vídeo o stories sueltas). Se presupuestan según lo que necesites.",
    "cfg.note.merch": "Merchandising y diseño extra se presupuestan aparte; con plan mensual tienes condiciones preferentes.",
    "cfg.sel": "{s} stories, {v} vídeos, {p} posts",
    "cfg.sel.web": " + web",
    "cfg.sel.merch": " + merchandising/diseño",
    "cfg.storiesPlus": "60+",
    "merch.cat.fisico": "Físico",
    "merch.cat.digital": "Digital",
    "merch.cat.papeleria": "Papelería",
    "merch.open": "{name}: ver en detalle",
    "merch.moved": "{name} movida en la mesa."
  };

  DICT.en = {
    "meta.title": "MarkeWeed · Portfolio",
    "meta.desc": "MarkeWeed commercial portfolio: social media, Google, photography, video and design for clubs and associations.",
    "a11y.closeMenu": "Close menu",
    "stories.play": "Play",
    "stories.live": "Story {n} of {total}: {label}",
    "spack.dow": "M,T,W,T,F,S,S",
    "spack.c8": "8 stories: about two a week, to keep the profile alive.",
    "spack.c22": "22 stories: almost one for every weekday of the month.",
    "spack.c32": "32 stories: daily presence, with extra on event days.",
    "spack.c60": "60+ stories: two or more a day. Maximum presence, tailor-made.",
    "interest.general": "General information",
    "interest.plan.inicio": "Inicio Plan (22 stories, 4 videos, 6 posts)",
    "interest.plan.clubsy": "Clubsy Plan (22 stories, 4 videos, 6 posts + website)",
    "interest.plan.weareclub": "WeAreClub Pack (32 stories, 6 videos, 8 posts)",
    "interest.service.design": "Design service",
    "interest.service.photo": "Photography service",
    "interest.service.video": "Video service",
    "interest.service.stories": "Instagram Stories Pack",
    "interest.stories": "Stories Pack ({n} stories a month)",
    "interest.storiesPlus": "Stories Pack (more than 60 stories a month)",
    "interest.merch": "Merchandise design",
    "interest.merchPiece": "Merchandise design: {piece}",
    "interest.config": "{name}. My selection: {sel}",
    "summary": "Hi, I've seen the MarkeWeed portfolio and I'm interested in: {x}.",
    "modal.copied": "Copied!",
    "modal.copiedLive": "Summary copied to the clipboard.",
    "modal.copyFail": "Couldn't copy. Select the message and copy it manually.",
    "cfg.n.inicio": "Inicio Plan",
    "cfg.n.clubsy": "Clubsy Plan",
    "cfg.n.clubsyPlus": "Clubsy Plan + extras",
    "cfg.n.weareclub": "WeAreClub Pack",
    "cfg.n.custom": "Tailor-made plan",
    "cfg.n.individual": "Individual services",
    "cfg.r.clubsy": "You want your own website: the Clubsy Plan includes a custom website with automatic invitation requests, plus 22 stories, 4 videos and 6 posts a month.",
    "cfg.r.clubsyPlus": "Clubsy + extras: you want a website and more content than the plan includes. You'll finalise it with your contact.",
    "cfg.r.weareclub": "You need more volume than the Inicio Plan: the WeAreClub Pack includes 32 stories, 6 videos and 8 posts a month.",
    "cfg.r.custom": "Your selection goes beyond the WeAreClub Pack. Tailor-made plan: check it with your contact.",
    "cfg.r.individual": "For something one-off, individual services fit better (design, photography, video or single stories). They're quoted based on what you need.",
    "cfg.note.merch": "Merchandise and extra design are quoted separately; with a monthly plan you get preferential terms.",
    "cfg.sel": "{s} stories, {v} videos, {p} posts",
    "cfg.sel.web": " + website",
    "cfg.sel.merch": " + merchandise/design",
    "cfg.storiesPlus": "60+",
    "merch.cat.fisico": "Physical",
    "merch.cat.digital": "Digital",
    "merch.cat.papeleria": "Stationery",
    "merch.open": "{name}: view in detail",
    "merch.moved": "{name} moved on the table.",

    /* --- Textos del HTML --- */
    "gate.label": "Restricted access · professional use",
    "gate.title": "Are you of legal age?",
    "gate.text": "This portfolio is for private, professional use and is intended exclusively for people over 18.",
    "gate.yes": "Yes, I'm over 18",
    "gate.no": "No",
    "gate.denied": "Sorry: this portfolio is only available to people of legal age.",
    "intro.skip": "Skip intro",
    "a11y.skip": "Skip to content",
    "a11y.lang": "Language",
    "a11y.home": "MarkeWeed — home",
    "a11y.sections": "Sections",
    "a11y.openMenu": "Open menu",
    "a11y.menu": "Menu",
    "a11y.scrollDown": "Scroll to the next section",
    "a11y.close": "Close",
    "nav.what": "What we do",
    "nav.services": "Services",
    "nav.stories": "Stories",
    "nav.merch": "Merch",
    "nav.packs": "Packs",
    "nav.process": "Process",
    "nav.legal": "Legal",
    "nav.faq": "FAQ",
    "cta.contact": "Contact",
    "cta.contactRep": "Contact my representative",
    "cta.seePacks": "See packs",
    "cta.interested": "I'm interested",
    "cta.planInterest": "I'm interested in this plan",
    "cta.talk": "Talk to the person who sent me this",

    "hero.eyebrow": "Commercial portfolio · private use",
    "hero.title": '<span class="line"><span>More members</span></span> <span class="line"><span>for your club.</span></span> <span class="line line--accent"><span>With content</span></span> <span class="line line--accent"><span>that complies.</span></span>',
    "hero.lead": "Commercial management for clubs and associations: social media, Google, photo, video and design. All within the legal margin.",
    "hero.badge": "PORTFOLIO · PRIVATE USE · MARKEWEED · 2026 ·",
    "hero.scroll": "Scroll",
    "sticker.video": "Video",

    "what.kicker": "What we do",
    "what.title": '<span class="line"><span>Three fronts.</span></span> <span class="line"><span>One goal:</span></span> <span class="line line--accent"><span>more members.</span></span>',
    "what.lead": "MarkeWeed is commercial management for cannabis clubs and associations. We help you attract new members through social media and Google, complying with the law as far as possible: what can't be published, isn't published.",
    "what.c1.title": "Social media and Google",
    "what.c1.text": "Attracting new members through social media and/or Google. We give your profiles structure so that whoever looks for you finds you and understands who you are.",
    "what.c1.t1": "Profile structure",
    "what.c1.t2": "Search and maps listing",
    "what.c1.t3": "Monthly calendar",
    "what.c2.title": "Content: photo and video",
    "what.c2.text": "We deliver content about your club, give your social media structure and produce our own photography and video, designed for social media, Google or web.",
    "what.c2.t1": "Photography",
    "what.c2.t2": "Video and reels",
    "what.c2.t3": "Tailored copy",
    "what.c3.title": "Design and merchandise",
    "what.c3.text": "Stories, posts, event posters, collectible-style tickets, trays, grinders and all kinds of merchandise for growshops, associations and clubs.",
    "what.c3.t1": "Stories and posts",
    "what.c3.t2": "Posters and tickets",
    "what.c3.t3": "Merchandise",
    "mq.social": "Social media",
    "mq.video": "Video",
    "mq.photo": "Photography",
    "mq.posters": "Posters",
    "mq.members": "More members",
    "mq.legal": "Within the legal margin",
    "mq.structure": "Social media structure",
    "mq.community": "Community",
    "mq.events": "Events",

    "services.kicker": "Individual services",
    "services.title": '<span class="line"><span>À la carte,</span></span> <span class="line line--accent"><span>whenever you need it.</span></span>',
    "services.lead": "One-off pieces and productions for your club or association. Tap each card to see what's included and an example.",
    "services.more": "See details",
    "services.design.title": "Design",
    "services.design.short": "Digital or physical graphic elements: trays, lighters, T-shirts, mugs, flyers, posters, tickets…",
    "services.photo.title": "Photography",
    "services.photo.short": "One-off photography of the club, an event or a private social gathering.",
    "services.video.title": "Video",
    "services.video.short": "One-off audiovisual production of the club, an event or a private social gathering.",
    "services.stories.title": "Stories Pack",
    "services.stories.short": "From 8 to 60+ stories to publish throughout the month.",
    "services.note": "Individual services are quoted separately based on what you need. Clubs with a monthly plan get preferential terms.",

    "stories.aria": "MarkeWeed example stories. Use the arrow keys to navigate.",
    "stories.prev": "Previous story",
    "stories.next": "Next story",
    "stories.pause": "Pause",
    "stories.time": "2 h",
    "stories.paused": "Paused",
    "stories.hint": "Tap left/right · press and hold to pause",
    "stories.kicker": "Stories in action",
    "stories.title": '<span class="line"><span>Your month,</span></span> <span class="line line--accent"><span>story by story.</span></span>',
    "stories.lead": "The Instagram Stories Pack goes from 8 to more than 60 stories a month, tailored to your club or association's information and always within the legal margin.",
    "stories.text": "Every story has a goal: introduce the club, announce an event, explain how to become a member, recall the rules or start a conversation with your community. This phone is a working example: try it.",
    "story.format": "Format",
    "story1.hi": "Hi,",
    "story1.text": "We're commercial management for clubs and associations. More members, content that complies.",
    "story1.sticker": "#whoweare",
    "story1.format": "Introduction",
    "story2.kicker": "This Friday",
    "story2.title": "<span>Vinyl</span><span>night</span>",
    "story2.meta": "9 pm · Members only",
    "story2.format": "Event + motion",
    "story3.title": "How to become a <em>member</em>",
    "story3.s1": "Request your invitation",
    "story3.s2": "Come and meet us",
    "story3.s3": "Welcome to the community",
    "story3.note": "Adults only",
    "story3.format": "Member info",
    "story4.title": "Our culture",
    "story4.w1": "Respect",
    "story4.w2": "Discretion",
    "story4.w3": "Community",
    "story4.w4": "Good vibes",
    "story4.format": "Club rules",
    "story5.kicker": "Agenda",
    "story5.title": "This month",
    "story5.e1": "Screen-printing workshop",
    "story5.e2": "Vinyl night",
    "story5.e3": "Chess tournament",
    "story5.e4": "Talk: culture and community",
    "story5.format": "Monthly agenda",
    "story6.title": "You decide",
    "story6.q": "Which activity do you prefer?",
    "story6.a": "Movie night",
    "story6.b": "Games tournament",
    "story6.thanks": "Thanks for voting!",
    "story6.text": "That's how easy it is to know what your community wants.",
    "story6.format": "Poll",
    "story7.kicker": "Only",
    "story7.d": "days",
    "story7.h": "hours",
    "story7.m": "min",
    "story7.s": "sec",
    "story7.text": "to go until Vinyl night",
    "story7.remind": "Remind me",
    "story7.format": "Countdown",
    "story8.title": "Shall we talk?",
    "story8.text": "If you want stories like these for your club, write to whoever sent you this portfolio.",
    "story8.btn": "I'm interested",
    "story8.format": "Call to action",
    "spack.label": "How many stories a month?",
    "spack.aria": "Stories per month",

    "feed.title": "And on the feed, posts that build a brand",
    "feed.sub": "Example posts for MarkeWeed's own profile. For your club, the same with your identity.",
    "feed.p1": "Typographic post: Content that complies",
    "feed.p1a": "CONTENT",
    "feed.p1b": "THAT",
    "feed.p1c": "COMPLIES.",
    "feed.c1": "Manifesto",
    "feed.p2": "Carousel: 5 ideas for your monthly agenda",
    "feed.p2a": "ideas for your",
    "feed.p2b": "monthly agenda",
    "feed.swipe": "SWIPE",
    "feed.c2": "Carousel",
    "feed.p3": "Post: social media structure",
    "feed.p3a": "SOCIAL MEDIA",
    "feed.p3b": "STRUCTURE",
    "feed.c3": "Structure",
    "feed.p4": "Reel: behind the scenes",
    "feed.p4a": "BEHIND",
    "feed.p4b": "THE SCENES",
    "feed.c4": "Reel",
    "feed.p5": "Post: new Clubsy Plan with its own website",
    "feed.p5k": "NEW",
    "feed.p5b": "REQUEST INVITATION",
    "feed.c5": "Launch",
    "feed.p6": "Brand post: tailor-made for your club",
    "feed.p6a": "TAILOR-MADE",
    "feed.c6": "Brand",

    "merch.kicker": "Merchandise",
    "merch.title": '<span class="line"><span>Your brand,</span></span> <span class="line line--accent"><span>on everything you touch.</span></span>',
    "merch.lead": "Graphic design applied to objects for clubs, associations and growshops. This is our worktable: drag the pieces, tilt them, change the collection's colour and tap to see them in detail.",
    "merch.filterAria": "Filter by category",
    "merch.f.all": "All",
    "merch.f.physical": "Physical",
    "merch.f.digital": "Digital",
    "merch.f.paper": "Stationery",
    "merch.color": "Colour",
    "merch.colorAria": "Collection colour",
    "merch.sw.orange": "Orange",
    "merch.sw.white": "White",
    "merch.reset": "Tidy up table",
    "merch.hint": "Drag · tilt · tap to enlarge. Illustrative pieces for a fictional club: “Club Ejemplo”.",
    "mk.example": "EJEMPLO",
    "mk.presents": "CLUB EJEMPLO PRESENTS",
    "mk.night1": "VINYL",
    "mk.night2": "NIGHT",
    "mk.ticketMeta": "FRI · 9 PM · MEMBERS ONLY",
    "mk.workshop1": "SCREEN-",
    "mk.workshop2": "PRINTING",
    "mk.workshopMeta": "SAT 07 · 6 PM",
    "mk.posterMeta": "FRIDAY · 9 PM · MEMBERS ONLY",
    "mk.coverTag": "COMMUNITY · EVENTS · CULTURE",
    "mk.h1": "RULES",
    "mk.h2": "EVENTS",
    "mk.h3": "MEMBERS",
    "mk.h4": "INFO",
    "mk.saturday": "SATURDAY",
    "mk.chess1": "CHESS",
    "mk.chess2": "TOURNAMENT",
    "mk.chessMeta": "SAT 18 · 5 PM",
    "merch.tray.name": "Tray",
    "merch.tray.detail": "Metal tray with full-colour print: the club's identity, its own pattern and a collection finish.",
    "merch.grinder.detail": "Lid engraved or printed with the club emblem. A circular design made to be read at a glance.",
    "merch.lighter.name": "Lighter",
    "merch.lighter.detail": "360° printed sleeve with the club's identity. Ideal as a welcome detail for new members.",
    "merch.tshirt.name": "T-shirt",
    "merch.tshirt.detail": "T-shirts for the team or for members: emblem on the chest, big type and sleeve details.",
    "merch.mug.name": "Mug",
    "merch.mug.detail": "Ceramic mug with wrap-around print: the emblem on the front and a band in the collection colour.",
    "merch.keychain.name": "Keyring",
    "merch.keychain.detail": "Acrylic or metal keyring with the die-cut emblem. Small, durable and very community.",
    "merch.ticket.name": "Ticket / entry",
    "merch.ticket.detail": "Numbered, collectible-style tickets for the club's internal events. Thick paper and a tear-off stub.",
    "merch.flyer.detail": "A5/A6 flyers for club activities: clear hierarchy, visible date and the collection's style.",
    "merch.poster.name": "Event poster",
    "merch.poster.detail": "Posters for the venue and their digital version for social media: the same piece, adapted to each format.",
    "merch.box.name": "Packaging",
    "merch.box.detail": "Boxes, bags and paper and cardboard pieces with the club's identity: welcome kits, gifts and events.",
    "merch.cover.name": "Social media cover",
    "merch.cover.detail": "Consistent covers, avatars and headers for every profile: the first thing people see when they look you up.",
    "merch.highlights.name": "Highlights",
    "merch.highlights.detail": "Matching story highlight icons: rules, events, members and info, always at hand.",
    "merch.stickers.name": "Stickers",
    "merch.stickers.detail": "Die-cut sticker sheets with the club's emblem, name and its own shapes. The most shared merchandise of all.",
    "merch.card.name": "Membership card",
    "merch.card.detail": "Membership card with the club's identity: number, emblem and special finishes. Belonging in your pocket.",
    "merch.story.name": "Event story",
    "merch.story.detail": "Event stories matching the poster and the ticket: countdown, reminder and the same identity everywhere.",
    "mk.memberCard": "MEMBERSHIP CARD",
    "mk.memberNo": "MEMBER NO. · 0137",
    "mk.remind": "REMIND ME",
    "merch.eventpost.name": "Event post",
    "merch.eventpost.detail": "Internal event posts with the same look as the physical poster: everything is recognisable at first sight.",
    "viewer.prev": "Previous piece",
    "viewer.next": "Next piece",
    "viewer.cta": "Want to design your club's merchandise? Contact whoever sent you this portfolio.",

    "packs.kicker": "Monthly packs",
    "packs.title": '<span class="line"><span>One plan a month.</span></span> <span class="line line--accent"><span>Content all month.</span></span>',
    "packs.lead": "Three monthly service plans. You give us access to the Instagram account and the club's information; we publish throughout the current month.",
    "packs.perMonth": "per month",
    "unit.videos": "videos",
    "packs.p1.tag": "Plan 01 · To get started",
    "packs.p1.desc": "Steady, organised presence on social media, without worrying about what to post each week.",
    "packs.p2.badge": "+ Own website",
    "packs.p2.tag": "Plan 02 · With website",
    "packs.p2.desc": "Everything in the Inicio Plan plus a custom website for your club with automatic invitation requests.",
    "packs.p2.extraTitle": "+ Custom website",
    "packs.p2.extraText": "With an automatic invitation request system by email.",
    "packs.p2.fine": "Includes building the website and the monthly service; your contact will explain the terms. The club covers separate costs, in its own name: domain, database (Supabase) and email sending (Resend).",
    "packs.p3.badge": "More content",
    "packs.p3.tag": "Plan 03 · Maximum presence",
    "packs.p3.desc": "For clubs that want to be present every day and really get their community moving.",
    "packs.f.publish": "Publishing throughout the month",
    "packs.f.structure": "Social media structure",
    "packs.f.preferred": "Preferential terms on individual services",
    "packs.cond.title": "Common to all plans",
    "packs.cond.1": "Monthly service: it starts at the beginning of each month",
    "packs.cond.2": "We publish throughout the current month",
    "packs.cond.3": "The club gives us access to its Instagram account",
    "packs.cond.4": "The payment method is confirmed later with your contact",
    "packs.cond.5": "Preferential terms on individual services",
    "packs.cond.6": "Merchandise, products and services not included are quoted separately",

    "cfg.kicker": "Configurator",
    "cfg.title": "Which one fits you?",
    "cfg.lead": "Move the controls and we'll recommend a plan. No commitment and no money figures: your contact will give you the details.",
    "cfg.stories": "Stories per month",
    "cfg.videos": "Videos per month",
    "cfg.posts": "Posts per month",
    "cfg.quick": "Quick story values",
    "cfg.web": "I want my own website with invitation requests",
    "cfg.merch": "I need merchandise / extra design",
    "cfg.recoLabel": "We recommend",
    "cfg.r.inicio": "It fits what you're looking for: steady presence with 22 stories, 4 videos and 6 posts a month.",
    "cfg.caption": "Comparison of your selection with the three plans",
    "cfg.you": "You",
    "cfg.rowVideos": "Videos",
    "cfg.yes": "Yes",
    "cfg.no": "No",
    "cfg.cta": "Contact about this selection",

    "process.kicker": "How we work",
    "process.title": '<span class="line"><span>Five steps.</span></span> <span class="line line--accent"><span>Zero hassle.</span></span>',
    "process.s1.t": "We talk",
    "process.s1.d": "Tell us what your club or association is like and what you need, through your MarkeWeed contact.",
    "process.s2.t": "We choose the plan",
    "process.s2.d": "Monthly pack or individual services, depending on your goals.",
    "process.s3.t": "Access and content",
    "process.s3.d": "You give us access to the Instagram account and the club's information; we confirm the payment method.",
    "process.s4.t": "We produce",
    "process.s4.d": "Social media structure, stories, posts, video and photo tailored to your club and to the legal margin.",
    "process.s5.t": "We publish all month",
    "process.s5.d": "The service starts at the beginning of each month and we publish throughout the current month.",

    "legal.kicker": "Legal framework",
    "legal.title": '<span class="line"><span>Growing</span></span> <span class="line line--accent"><span>without bending</span></span> <span class="line line--accent"><span>the law.</span></span>',
    "legal.lead": "Attracting members and complying go hand in hand. These are the principles behind every piece we make.",
    "legal.p1.t": "Within the legal margin",
    "legal.p1.d": "We limit services, posts, copy and content to the legal margin. What can't be published, isn't published.",
    "legal.p2.t": "Adults only",
    "legal.p2.d": "Communication aimed at adults, without encouraging consumption and without offers, prices or product promotions.",
    "legal.p3.t": "Adapted to each platform",
    "legal.p3.d": "Language and content adjusted to the rules of each social network, of Google and to current regulations.",
    "legal.p4.t": "Fictional examples",
    "legal.p4.d": "All the content in this portfolio is illustrative and fictional. We never use content from other clubs.",
    "legal.disclaimer": "This information is for guidance only and does not constitute legal advice.",

    "faq.kicker": "Frequently asked questions",
    "faq.title": '<span class="line"><span>What</span></span> <span class="line"><span>people always</span></span> <span class="line line--accent"><span>ask us.</span></span>',
    "faq.lead": "Got another question? Anything not covered here is worked out with your contact.",
    "faq.q1": "What do I need to get started?",
    "faq.a1": "Access to the club's Instagram account and information about the club or association (activities, rules, opening hours, events…). With that, we start producing.",
    "faq.q2": "When does the service run?",
    "faq.a2": "The service starts at the beginning of each month and we publish throughout the current month.",
    "faq.q3": "How do I pay?",
    "faq.a3": "Payment works at the beginning of each month. The payment method is confirmed later with your MarkeWeed contact.",
    "faq.q4": "Are individual services included in the packs?",
    "faq.a4": "No. Merchandise, extra design, one-off photography or video are quoted separately. If you have a monthly plan, you get preferential terms.",
    "faq.q5": "What does the Clubsy Plan website include?",
    "faq.a5": "A custom website for your club with an automatic invitation request system by email. The domain, the database (Supabase) and email sending (Resend) are paid by the club and registered in its name.",
    "faq.q6": "Do you work with Google as well as social media?",
    "faq.a6": "Yes. We attract members through social media and/or Google, whichever suits your club best.",
    "faq.q7": "Can I ask for more content than a plan includes?",
    "faq.a7": "Yes. If you need more volume than the WeAreClub Pack or something very specific, a tailor-made plan is put together with your contact.",
    "faq.q8": "What about my privacy?",
    "faq.a8": "It's a priority. We never show content from other clubs and this portfolio contains no contact details: that's why you talk directly to the person who sent it to you.",

    "closing.kicker": "Next step",
    "closing.title": '<span class="line"><span>Shall we start?</span></span>',
    "closing.lead": "Write to the person who sent you this portfolio and tell them what you're interested in. From there, we'll take care of the rest.",
    "closing.mq": "Talk to the person who sent you this portfolio",

    "footer.adult": "Content for people over 18 · professional use",
    "footer.private": "Commercial portfolio · private use",
    "footer.fictional": "All examples are illustrative and fictional.",

    "sheet.kicker": "Individual service · 01",
    "sheet.kicker2": "Individual service · 02",
    "sheet.kicker3": "Individual service · 03",
    "sheet.kicker4": "Individual service · 04",
    "sheet.ctaText": "Interested in this service? Contact the person who sent you this portfolio to continue.",
    "sheet.design.text": "All kinds of graphic elements, digital or physical, with your club or association's identity. We design the piece, prepare the files for production and make sure everything fits your brand and the legal margin.",
    "sheet.design.sub": "What we can design",
    "sheet.design.c1": "Trays",
    "sheet.design.c2": "Lighters",
    "sheet.design.c3": "T-shirts",
    "sheet.design.c4": "Paper and cardboard",
    "sheet.design.c5": "Mugs",
    "sheet.design.c6": "Keyrings",
    "sheet.design.c7": "Covers",
    "sheet.design.c9": "Posters",
    "sheet.photo.text": "One-off photography of the club, an event or a private social gathering, for social media, Google or web. Spaces, atmosphere and details that tell people who you are, always protecting members' privacy.",
    "sheet.photo.sub": "Ideal for",
    "sheet.photo.c1": "The club's space",
    "sheet.photo.c2": "Events",
    "sheet.photo.c3": "Private social gatherings",
    "sheet.photo.c4": "Google listing",
    "sheet.photo.c6": "Social media",
    "sheet.video.titleCard": "YOUR CLUB",
    "sheet.video.text": "One-off audiovisual production of the club, an event or a private social gathering, for social media, Google or web. Shooting, editing, titles and versions for every format.",
    "sheet.video.sub": "Formats",
    "sheet.video.c2": "Video stories",
    "sheet.video.c3": "Event recaps",
    "sheet.video.c4": "Video for the website",
    "sheet.video.c5": "Motion pieces",
    "sheet.stories.event": "EVENT",
    "sheet.stories.poll": "POLL",
    "sheet.stories.text": "From 8 to more than 60 Instagram stories to publish throughout the month, tailored to your club or association's information and to the legal margin.",
    "sheet.stories.sub": "Formats we combine",
    "sheet.stories.c2": "Events",
    "sheet.stories.see": "See the example",

    "modal.kicker": "Next step",
    "modal.title": "Talk to the person who sent you this portfolio",
    "modal.text": "For privacy reasons, there are no contact details here. Write to them through the same channel you received this portfolio on and tell them what you're interested in.",
    "modal.interest": "Your interest",
    "modal.message": "Suggested message",
    "modal.copy": "Copy summary",
    "modal.keep": "Keep browsing"
  };

  var LANGS = ["es", "en"];
  var STORE_KEY = "mw-lang";
  var esFromDom = {};
  var current = document.documentElement.getAttribute("data-lang") || "es";
  var harvested = false;

  function format(str, params) {
    if (!params) return str;
    return str.replace(/\{(\w+)\}/g, function (m, k) {
      return params[k] != null ? params[k] : m;
    });
  }

  function lookup(key, lang) {
    var d = DICT[lang] || {};
    if (d[key] != null) return d[key];
    if (lang === "es" && esFromDom[key] != null) return esFromDom[key];
    return null;
  }

  function t(key, params, lang) {
    lang = lang || current;
    var v = lookup(key, lang);
    if (v == null) v = lookup(key, "es");
    if (v == null) v = key;
    return format(v, params);
  }

  function parseAttr(spec) {
    return spec.split(";").map(function (pair) {
      var i = pair.indexOf(":");
      return { attr: pair.slice(0, i).trim(), key: pair.slice(i + 1).trim() };
    });
  }

  function harvest() {
    if (harvested) return;
    harvested = true;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (esFromDom[k] == null) esFromDom[k] = el.textContent;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var k = el.getAttribute("data-i18n-html");
      if (esFromDom[k] == null) esFromDom[k] = el.innerHTML;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      parseAttr(el.getAttribute("data-i18n-attr")).forEach(function (p) {
        if (esFromDom[p.key] == null) esFromDom[p.key] = el.getAttribute(p.attr) || "";
      });
    });
  }

  function apply(lang, opts) {
    harvest();
    if (LANGS.indexOf(lang) === -1) lang = "es";
    current = lang;
    var root = document.documentElement;
    root.lang = lang;
    root.setAttribute("data-lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"));
      if (el.textContent !== v) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n-html"));
      if (el.innerHTML !== v) {
        var wasIn = el.classList.contains("is-in");
        el.innerHTML = v;
        if (wasIn && window.MW && MW.indexLines) MW.indexLines(el);
      }
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      parseAttr(el.getAttribute("data-i18n-attr")).forEach(function (p) {
        el.setAttribute(p.attr, t(p.key));
      });
    });

    document.title = t("meta.title");
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("meta.desc"));

    document.querySelectorAll("[data-lang]").forEach(function (b) {
      if (b.tagName === "BUTTON") b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });

    if (!opts || opts.persist !== false) {
      try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* almacenamiento no disponible */ }
    }
    document.dispatchEvent(new CustomEvent("mw:lang", { detail: { lang: lang } }));
  }

  window.MW = window.MW || {};
  MW.i18n = {
    t: t,
    apply: apply,
    harvest: harvest,
    get lang() { return current; },
    DICT: DICT
  };
})();
