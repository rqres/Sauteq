(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[712],{6953:function(e,t,a){Promise.resolve().then(a.t.bind(a,6656,23)),Promise.resolve().then(a.t.bind(a,6208,23)),Promise.resolve().then(a.t.bind(a,8169,23)),Promise.resolve().then(a.t.bind(a,3699,23)),Promise.resolve().then(a.bind(a,3530)),Promise.resolve().then(a.bind(a,1726)),Promise.resolve().then(a.bind(a,1507)),Promise.resolve().then(a.bind(a,7303)),Promise.resolve().then(a.bind(a,8424)),Promise.resolve().then(a.bind(a,2331)),Promise.resolve().then(a.bind(a,5966)),Promise.resolve().then(a.t.bind(a,6685,23)),Promise.resolve().then(a.bind(a,7446)),Promise.resolve().then(a.bind(a,7764)),Promise.resolve().then(a.t.bind(a,3222,23))},8424:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return l}});var r=a(6705),n=a(955),o=a(4033),s=a(3664),d=a(2664),i=a(3762);function l(e){let{currentUserId:t,followeeId:a,followsInit:l}=e,{getToken:f}=(0,d.aC)(),[c,u]=(0,n.useState)(l),b=(0,o.useRouter)();return(0,r.jsx)(i.z,{onClick:async()=>{t||(0,o.notFound)();let e=await f({template:"supabase"});e||(0,o.notFound)(),c?(0,s.mM)({followerId:t,followeeId:a,token:e}):(0,s.vs)({followerId:t,followeeId:a,token:e}),b.refresh(),u(!c)},children:"".concat(c?"Following":"Follow")})}},2331:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return l}});var r=a(6705),n=a(955),o=a(2664),s=a(306);let d=n.forwardRef((e,t)=>{let{className:a,...n}=e;return(0,r.jsx)("textarea",{className:(0,s.cn)("flex min-h-[60px] w-full rounded-md border border-stone-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-800 dark:placeholder:text-stone-400 dark:focus-visible:ring-stone-800",a),ref:t,...n})});d.displayName="Textarea";var i=a(3762);function l(e){let{editable:t,metadata:a}=e,[s,l]=(0,n.useState)(!1),[f,c]=(0,n.useState)(a.bio),{isLoaded:u,isSignedIn:b,user:m}=(0,o.aF)(),h=()=>{try{null==m||m.update({unsafeMetadata:{bio:f}})}catch(e){console.error(e)}};return t&&u&&b?(0,r.jsxs)(r.Fragment,{children:[s&&(0,r.jsxs)("div",{className:"flex gap-2",children:[(0,r.jsx)(d,{value:f,onChange:e=>c(e.target.value),placeholder:"Tell us something about yourself...",className:"resize-none"}),(0,r.jsx)(i.z,{onClick:()=>{h(),l(!1)},children:"Done"})]}),!s&&void 0!==m.unsafeMetadata.bio&&""!==m.unsafeMetadata.bio&&(0,r.jsx)("p",{className:"-ml-2 rounded-md border-2 border-stone-200/0 px-2 py-4 transition-colors ease-in-out hover:border-stone-200/100 dark:border-stone-800/0 hover:dark:border-stone-800/100",onClick:()=>l(!0),children:String(m.unsafeMetadata.bio)}),!s&&(void 0===m.unsafeMetadata.bio||""===m.unsafeMetadata.bio)&&(0,r.jsx)("p",{onClick:()=>l(!0),className:"-ml-2 rounded-md border-2 border-stone-200/0 px-2 py-4 text-stone-500 transition-colors ease-in-out hover:border-stone-200/100 dark:border-stone-800/0 dark:text-stone-400 hover:dark:border-stone-800/100",children:"Add a bio"})]}):(0,r.jsx)("p",{children:void 0!==a.bio?String(a.bio):""})}},5966:function(e,t,a){"use strict";a.r(t),a.d(t,{Avatar:function(){return d},AvatarFallback:function(){return l},AvatarImage:function(){return i}});var r=a(6705),n=a(955),o=a(6694),s=a(306);let d=n.forwardRef((e,t)=>{let{className:a,...n}=e;return(0,r.jsx)(o.fC,{ref:t,className:(0,s.cn)("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",a),...n})});d.displayName=o.fC.displayName;let i=n.forwardRef((e,t)=>{let{className:a,...n}=e;return(0,r.jsx)(o.Ee,{ref:t,className:(0,s.cn)("aspect-square h-full w-full",a),...n})});i.displayName=o.Ee.displayName;let l=n.forwardRef((e,t)=>{let{className:a,...n}=e;return(0,r.jsx)(o.NY,{ref:t,className:(0,s.cn)("flex h-full w-full items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800",a),...n})});l.displayName=o.NY.displayName},3762:function(e,t,a){"use strict";a.d(t,{z:function(){return l}});var r=a(6705),n=a(955),o=a(7256),s=a(7404),d=a(306);let i=(0,s.j)("inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-stone-800",{variants:{variant:{default:"bg-stone-900 text-stone-50 shadow hover:bg-stone-900/90 dark:bg-stone-50 dark:text-stone-900 dark:hover:bg-stone-50/90",destructive:"bg-red-500 text-stone-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-red-50 dark:hover:bg-red-900/90",outline:"border border-stone-200 bg-white shadow-sm hover:bg-stone-100 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-950 dark:hover:bg-stone-800 dark:hover:text-stone-50",secondary:"bg-stone-100 text-stone-900 shadow-sm hover:bg-stone-100/80 dark:bg-stone-800 dark:text-stone-50 dark:hover:bg-stone-800/80",ghost:"hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-stone-50",link:"text-stone-900 underline-offset-4 hover:underline dark:text-stone-50"},size:{default:"h-9 px-4 py-2",sm:"h-8 rounded-md px-3 text-xs",lg:"h-10 rounded-md px-8",icon:"h-9 w-9"}},defaultVariants:{variant:"default",size:"default"}}),l=n.forwardRef((e,t)=>{let{className:a,variant:n,size:s,asChild:l=!1,...f}=e,c=l?o.g7:"button";return(0,r.jsx)(c,{className:(0,d.cn)(i({variant:n,size:s,className:a})),ref:t,...f})});l.displayName="Button"},7764:function(e,t,a){"use strict";a.r(t),a.d(t,{Label:function(){return l}});var r=a(6705),n=a(955),o=a(6743),s=a(7404),d=a(306);let i=(0,s.j)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),l=n.forwardRef((e,t)=>{let{className:a,...n}=e;return(0,r.jsx)(o.f,{ref:t,className:(0,d.cn)(i(),a),...n})});l.displayName=o.f.displayName},7446:function(e,t,a){"use strict";a.r(t),a.d(t,{Sheet:function(){return l},SheetClose:function(){return c},SheetContent:function(){return h},SheetDescription:function(){return g},SheetFooter:function(){return p},SheetHeader:function(){return x},SheetTitle:function(){return v},SheetTrigger:function(){return f}});var r=a(6705),n=a(955),o=a(8712),s=a(9394),d=a(7404),i=a(306);let l=o.fC,f=o.xz,c=o.x8,u=e=>{let{className:t,...a}=e;return(0,r.jsx)(o.h_,{className:(0,i.cn)(t),...a})};u.displayName=o.h_.displayName;let b=n.forwardRef((e,t)=>{let{className:a,...n}=e;return(0,r.jsx)(o.aV,{className:(0,i.cn)("fixed inset-0 z-50 bg-white/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-stone-950/80",a),...n,ref:t})});b.displayName=o.aV.displayName;let m=(0,d.j)("fixed z-50 gap-4 bg-white p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 dark:bg-stone-950",{variants:{side:{top:"inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",bottom:"inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",left:"inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",right:"inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"}},defaultVariants:{side:"right"}}),h=n.forwardRef((e,t)=>{let{side:a="right",className:n,children:d,...l}=e;return(0,r.jsxs)(u,{children:[(0,r.jsx)(b,{}),(0,r.jsxs)(o.VY,{ref:t,className:(0,i.cn)(m({side:a}),n),...l,children:[d,(0,r.jsxs)(o.x8,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-stone-100 dark:ring-offset-stone-950 dark:focus:ring-stone-800 dark:data-[state=open]:bg-stone-800",children:[(0,r.jsx)(s.Pxu,{className:"h-4 w-4"}),(0,r.jsx)("span",{className:"sr-only",children:"Close"})]})]})]})});h.displayName=o.VY.displayName;let x=e=>{let{className:t,...a}=e;return(0,r.jsx)("div",{className:(0,i.cn)("flex flex-col space-y-2 text-center sm:text-left",t),...a})};x.displayName="SheetHeader";let p=e=>{let{className:t,...a}=e;return(0,r.jsx)("div",{className:(0,i.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",t),...a})};p.displayName="SheetFooter";let v=n.forwardRef((e,t)=>{let{className:a,...n}=e;return(0,r.jsx)(o.Dx,{ref:t,className:(0,i.cn)("text-lg font-semibold text-stone-950 dark:text-stone-50",a),...n})});v.displayName=o.Dx.displayName;let g=n.forwardRef((e,t)=>{let{className:a,...n}=e;return(0,r.jsx)(o.dk,{ref:t,className:(0,i.cn)("text-sm text-stone-500 dark:text-stone-400",a),...n})});g.displayName=o.dk.displayName},306:function(e,t,a){"use strict";a.d(t,{cn:function(){return o}});var r=a(348),n=a(3986);function o(){for(var e=arguments.length,t=Array(e),a=0;a<e;a++)t[a]=arguments[a];return(0,n.m)((0,r.W)(t))}},3664:function(e,t,a){"use strict";a.d(t,{B5:function(){return d},IU:function(){return i},XD:function(){return n},mM:function(){return s},vs:function(){return o}}),a(4039),a(470);var r=a(1162);(0,r.Z)("b4889c17c14bec14966e4bbb069c01d8e86f60fb"),(0,r.Z)("8bccfef36489053a4d6d1e4ed27f580019f4a214"),(0,r.Z)("3dee1128b583587177cfe41943d3cb56e8d85f24"),(0,r.Z)("fb580e2d318ec2393a4b52b73ab07196824e3eca"),(0,r.Z)("f9641296923c6c593521a643d71b4ffb8304ecc8");var n=(0,r.Z)("427ee56288f29bb9558a815cc5af4226caa85ed2");(0,r.Z)("3a9ea48fca5d036d796769b83f490bd22d369792"),(0,r.Z)("9f2e81979254c620afe859750e1571ad9cd7f601"),(0,r.Z)("14cddf921444db93d3cc1b43b77b13c9ff98ff5f"),(0,r.Z)("592822d509b55afcfb798c8946867442497e08c6");var o=(0,r.Z)("d3bb40d2cb43b42ad1515bac4cff30fbf24484ab"),s=(0,r.Z)("59e4dd9d2b17d9d9a61d5a523b047272c987e132");(0,r.Z)("9bb2364c016ad551a5016e84e9f69434a1a881d0"),(0,r.Z)("a5f4f1bc2a67d11ce12067a49101b503b65e0bd0"),(0,r.Z)("b8f38d52aa6ca8dc2925f94a91002f14b39212ac"),(0,r.Z)("80b2afd58497d3cec58ed96f05f3990ae84e1823"),(0,r.Z)("6dc210fc74f9f36a3892e4a6a060993096666e4a");var d=(0,r.Z)("eb3c87bf52a41d4c8a9d1dfa205d881987ddb2a9"),i=(0,r.Z)("eac7c161d79493e6de55c3da8a1e5cd1fe9d8e3b")}},function(e){e.O(0,[310,519,59,222,685,55,121,114,744],function(){return e(e.s=6953)}),_N_E=e.O()}]);