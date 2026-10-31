# تقرير اختبارات النسخة البحثية الثانية

التاريخ 31 أكتوبر 2026. اختبارات برمجية دون جمع بيانات مشاركين. لا تعني هذه النتائج دقة تعرف ميدانية أو مقاومة انتحال مثبتة.

## اختبارات المتصفح المنفذة

شُغلت النسخة الفعلية في Edge عبر خادم loopback محلي باستخدام Playwright. تحمّلت المكتبة والشبكات الثلاث من ملفات الحزمة. لم تسجل مراقبة طلبات الصفحة طلباً إلى مضيف خارجي، ولم تسجل pageerror. هذا فحص للطلبات التي أطلقتها الصفحة أثناء الاختبار؛ ليس تدقيقاً لشبكة المتصفح أو نظام التشغيل كله.

تم تشغيل TinyFaceDetector فعلياً على canvas فارغ وكانت النتيجة صفر وجوه. لم تستخدم صورة مشارك. أما مسارات قرارات الهوية التالية فقد اختُبرت بمتجهات اصطناعية مضبوطة، باستخدام دالة المسافة من المكتبة الحقيقية، ولا تمثل تقييم نموذج التعرف على وجوه حقيقية:

1. قبول هوية مسجلة صحيحة.
2. حفظ قبول خاطئ لمشارك موسوم غير مسجل عندما يشبه متجهه المسجل.
3. رفض غير مسجل بعيد في فضاء المتجهات.
4. حفظ القبول بهوية خاطئة منفصلاً عن الرفض.
5. حفظ محاولة عدم اكتشاف وجه كرفض للمسجل.
6. تصنيف عدة وجوه كحالة غير صالحة.
7. عدم قبول مسجل بمجرد المطابقة عند تفعيل الحيوية، ثم قبول مسار اجتياز التحدي المحاكى.
8. حفظ رفض مهلة الحيوية، ومنع إكمال تحدي بعد انتهاء مهلته.
9. حفظ الإلغاء كحالة غير صالحة.
10. تثبيت إعدادات العتبة أثناء المحاولة وتحريرها بعد النهاية.
11. بقاء الحضور الرسمي دون تغيير أثناء التجارب.
12. عدم تقدم حالة الحيوية عندما يفشل الإطار في مطابقة الهوية.
13. اقتباس CSV ومضاعفة الاقتباسات الداخلية وتحييد بادئة الصيغة.
14. دورة تشفير وفك تشفير Web Crypto، ورفض كلمة مرور خاطئة.

الخلاصة الآلية: 18 تحقّقاً برمجياً و10 صفوف محاولات اصطناعية أثناء الاختبار، مع عدم وجود أخطاء JavaScript للصفحة. الأعداد تخص assertions ومسارات محاكاة، وليست عدد تجارب بشرية. راجع tests/verified_test_summary.json ومصدر الاختبار.

## التحليل والنماذج والمصدر

اجتاز محلل Python تجميع سجل اصطناعي، ورفض تكرار trial_id، والتعامل مع مقام فارغ في فاصل Wilson، واستبعاد الحالات غير الصالحة، وفحص الفاصل لعدد 80 نجاحاً من 80. طابقت أحجام بيانات الأوزان المحسوبة من الأشكال وأنواع quantization مجموع أحجام shards في manifests الثلاثة. الملفات المطلوبة جميعها موجودة. هذه ليست مقارنة توقيع تشفيري مع ناشر الأوزان؛ البصمات المحلية توثق الإصدار المسلم.

أكدت SHA-256 التطابق التام بين Manuscript_submitted.docx داخل ZIP وملف تقييم البحث.docx، وبين Review_Report.docx داخل ZIP وReview Report(1).docx. مصدر HTML الأقدم مختلف عن مصدر الحيوية الذي بني عليه التحديث. استخرجت تعليقات Word العربية الخمسة والعشرين وجرى ربطها في تقرير الاستجابة.

## ما لم يختبر

لم تنفذ مشاركة بشرية، أو كاميرا على وجوه فعلية، أو اختبارات طباعة وشاشة وفيديو حقيقية، أو قياسات lux، أو مقارنة زمنية يدوية، أو فحص توسع المعرض، أو اختبار أمان اختراق مستقل. لم يثبت انعدام تسرب البيانات أو مقاومة PAD معيارية. لم يختبر فقد الطاقة أثناء الكتابة أو امتلاء كل أنواع التخزين أو جميع المتصفحات والأجهزة. اختبار التشفير المباشر لا يغطي كل حالات استيراد النسخ الاحتياطية أو اختراق حساب الجهاز.

كل هذه البنود تتطلب التنفيذ وفق البروتوكول وتسجيل النتائج، ولا تستنتج من مرور الاختبارات البرمجية.


## PWA revision 2.1.0-research

Added a scoped service worker, manifest, 192/512 PNG icons, Apple touch icon, Arabic installation/recovery instructions and a 15-resource completeness indicator. Static worker-logic checks passed: complete-cache report, offline shell/library/model cache responses, scope-specific old-cache cleanup, exclusion of non-static/private files, cross-origin and non-GET exclusion, incomplete-cache detection, manifest scope/start URL and PNG dimensions. All application scripts pass syntax compilation. These are software checks with a simulated worker environment.

The end-to-end offline reload test is supplied as tests/test_pwa.cjs. Its local execution could not start Edge in the current restricted environment; no successful end-to-end offline run is claimed here. The prior 2.0.0 browser decision-path tests remain historical evidence for the unchanged recognition logic. Physical Android/iOS/desktop installation, offline camera capture and cross-device encrypted-backup recovery remain operational validation tasks in the Arabic protocol. No participant accuracy, spoof resistance, universal compatibility or device-loss recovery results have been fabricated.
