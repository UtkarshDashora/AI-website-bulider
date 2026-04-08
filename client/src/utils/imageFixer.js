export const getImageFixerScript = (title = "") => `
(function() {
    // Ironclad Image Fixer (v6.1) - Aggressive Relevance & Visibility
    const assetLibrary = {
        gaming: ['1542751371-adc38448a05e', '1538481199705-c710c4e965fc', '1534423861386-85a16f5d13fd', '1550745165-9bc0b252726f', '1586182987320-4f376d39d787'],
        medical: ['1576091160550-2173dba999ef', '1585421514738-01798e348b17', '1532187863486-abf9dbad1b69', '1551601651-2a8555f1a136', '1638202993928-7267aad84c31'],
        education: ['1524995997946-a1c2e315a42f', '1497633762265-9d179a990aa6', '1503676260728-1c00da094a0b', '1532012197267-da84d127e765', '1509062522246-3755977927d7'],
        realestate: ['1580587771525-78b9dba3b914', '1570129477492-45c003edd2be', '1565480401286-ea5dceac02a8', '1600992045264-136a22de917e', '1560518883-ce09059eeffa'],
        fitness: ['1627483298606-cf54c61779a9', '1526506118085-60ce8714f8c5', '1517836357463-d25dfeac3438', '1576678927484-cc907957088c', '1583454110551-21f2fa2afe61'],
        travel: ['1707344088547-3cf7cea5ca49', '1500835556837-99ac94a94552', '1501785888041-af3ef285b470', '1476514525535-07fb3b4ae5f1', '1469854523086-cc02fe5d8800'],
        finance: ['1579621970795-87facc2f976d', '1628348068343-c6a848d2b6dd', '1454165804606-c3d57bc86b40', '1506787497326-c2736dde1bef', '1486406146926-c627a92ad1ab'],
        music: ['1470225620780-dba8ba36b745', '1511379938547-c1f69419868d', '1507838153414-b4b713384a76', '1493225457124-a3eb161ffa5f', '1458560871784-56d23406c091'],
        pets: ['1623387641168-d9803ddd3f35', '1450778869180-41d0601e046e', '1592194996308-7b43878e84a6', '1522276498395-f4f68f7f8454', '1583337130417-3346a1be7dee'],
        sweet: ['1495147466023-ac5c588e2e94', '1558326567-98ae2405596b', '1533910534207-90f31029a78e', '1517683551739-7f3f08efba84', '1595397351604-cf490cc38bf1'],
        bus: ['1557223562-6c77ef16210f', '1632276536839-84cad7fd03b0', '1544620347-c4fd4a3d5957', '1544190312-44b545e98ef0', '1570125909232-eb263c188f7e'],
        car: ['1494906104456-d847c58c290bb', '1533473364812-dfdfdfdfdfdf', '1525609004556-c46c7d6cf023', '1503376780353-c8dc4cc27d3c', '1542281286744-3e0c01f42213'],
        flight: ['1436491865332-5a6299062a73', '1587019158091-1a103c5dd17f', '1527605158555-853f200063e9', '1605590427165-3884d6aa6731', '1556388158-158ea5ccacbd'],
        floral: ['1561848355-890d054dc55a', '1579167728798-a1cf3d595960', '1582794543139-8ac9cb0f7b11', '1523308458373-c6f61ae1fd21', '1532211387405-12202cb81d7b'],
        clinic: ['1631248055158-edec7a3c072b', '1629909613654-28e377c37b09', '1579488081688-3dbbbae7893e', '1629909614456-6b1c5c94cecc', '1519494026892-80bbd2d6fd0d'],
        ai: ['1523961131990-5ea7c61b2107', '1677442135703-1787eea5ce01', '1674027444485-cec3da58eef4', '1680783954745-3249be59e527', '1694903089438-bf28d4697d9a'],
        food: ['1546069901-ba9599a7e63c', '1482049016688-2d3e1b311543', '1565299624946-b28f40a0ae38', '1555939594-58d7cb561ad1', '1512621776951-a57141f2eefd'],
        business: ['1556745757-8d76bdb6984b', '1486406146926-c627a92ad1ab', '1508385082359-f38ae991e8f2', '1507679799987-c7377f0fefe1', '1664575602276-acd073f104c1'],
        nature: ['1470071459604-3b5ec3a7fe05', '1465146344425-f00d5f5c8f07', '1433086966358-54859d0ed716', '1472396961693-142e6e269027', '1518173946687-a4c8892bbd9f'],
        watch: ['1523170335258-f5ed11844a49', '1524805444758-089113d48a6d', '1542496658-e33a6d0d50f6', '1547996160-81dfa63595aa', '1622434641406-a158123450f9'],
        fashion: ['1515886657613-9f3515b0c78f', '1483985988355-763728e1935b', '1529139574466-a303027c1d8b', '1603189343302-e603f7add05a', '1571513800374-df1bbe650e56'],
        tech: ['1451187580459-43490279c0fa', '1523961131990-5ea7c61b2107', '1597733336794-12d05021d510', '1531297484001-80022131f5a1', '1550751827-4bd374c3f58b'],
        default: ['1506744038136-46273834b3fb']
    };

    const getCategoryOfId = (url) => {
        if (!url || !url.includes('unsplash.com')) return null;
        for (const cat in assetLibrary) {
            if (assetLibrary[cat].some(id => url.includes(id))) return cat;
        }
        return null;
    };

    const fixSingle = (img) => {
        // ALWAYS ensure visibility and reset potential broken styles from AI
        img.style.display = 'block';
        img.style.opacity = '1';
        img.style.visibility = 'visible';
        img.style.minWidth = '50px';
        img.style.minHeight = '50px';

        // Always ensure crossorigin for Unsplash
        if (img.src && img.src.includes('unsplash.com')) {
            img.setAttribute('crossorigin', 'anonymous');
        }

        const isBroken = img.hasAttribute('data-broken') || (img.complete && img.naturalWidth <= 1);
        const isPlaceholder = !img.src || img.src.includes('placeholder') || img.src.includes('base64');
        
        const alt = (img.alt || '').toLowerCase();
        const h1 = (document.querySelector('h1')?.innerText || '').toLowerCase();
        const titleText = "${title}".toLowerCase();
        const h2s = Array.from(document.querySelectorAll('h2, h3')).map(h => h.innerText.toLowerCase()).join(' ');
        const context = alt + ' ' + h1 + ' ' + titleText + ' ' + h2s;

        const getDetectedCategory = () => {
            if (/sweet|candy|dessert|sugar|chocolate|bakery|cake/i.test(context)) return 'sweet';
            if (/bus|coach|shuttle|transit/i.test(context)) return 'bus';
            if (/car|auto|vehicle|drive|rental/i.test(context)) return 'car';
            if (/flight|plane|aviation|airport|airline/i.test(context)) return 'flight';
            if (/rose|flower|floral|garden|bloom/i.test(context)) return 'floral';
            if (/food|dine|restaurant|chef|meal|cook/i.test(context)) return 'food';
            if (/medical|doctor|health|clinic|hospital|dental|nurse/i.test(context)) return 'medical';
            if (/education|learn|school|university|student|teacher|study|course/i.test(context)) return 'education';
            if (/real estate|house|home|apartment|property|building|architecture/i.test(context)) return 'realestate';
            if (/fitness|gym|workout|exercise|sport|athlete|training/i.test(context)) return 'fitness';
            if (/travel|tour|adventure|trip|vacation|hotel|resort/i.test(context)) return 'travel';
            if (/finance|money|bank|investment|legal|law|consulting|tax/i.test(context)) return 'finance';
            if (/music|audio|song|band|concert|instrument|dj/i.test(context)) return 'music';
            if (/pet|dog|cat|animal|vet|zoo/i.test(context)) return 'pets';
            if (/ai|bot|tech|software|algorithm|cyber|smart/i.test(context)) return 'ai';
            if (/game|studios|play|gaming|console|controller/i.test(context)) return 'gaming';
            if (/watch|clock|time|lux|chronoluxe|chrono/i.test(context)) return 'watch';
            if (/fashion|style|wear|retail|clothing|boutique/i.test(context)) return 'fashion';
            if (/business|creative|agency|startup|company|corporate/i.test(context)) return 'business';
            if (/nature|landscape|mountain|forest|outdoor/i.test(context)) return 'nature';
            return 'default';
        };

        const detectedCat = getDetectedCategory();
        const currentCatOfSrc = getCategoryOfId(img.src);

        // CATEGORICAL VERIFICATION:
        // Swap if: 1. Broken, 2. Placeholder, 3. Mismatched category (e.g. food on watch site)
        const needsFix = isBroken || isPlaceholder || (currentCatOfSrc && currentCatOfSrc !== detectedCat);

        if (!needsFix && img.src && img.src.includes('unsplash.com')) {
            // Respect AI choice if it's already from Unsplash and matches the general context
            img.setAttribute('data-ironclad-v6-1', 'true');
            return; 
        }

        if (img.hasAttribute('data-ironclad-v6-1') && !isBroken) return;

        const list = assetLibrary[detectedCat] || assetLibrary.default;
        const allImgs = Array.from(document.querySelectorAll('img'));
        const myIdx = allImgs.indexOf(img);
        
        const applySrc = (idx) => {
            const ID = list[idx % list.length];
            const newSrc = "https://images.unsplash.com/photo-" + ID + "?auto=format&fit=crop&w=1200&q=80";
            
            if (img.src !== newSrc) {
                img.style.transition = 'opacity 0.4s ease-in-out';
                img.style.opacity = '0.3';
                setTimeout(() => {
                    img.src = newSrc;
                    img.style.opacity = '1';
                }, 200);
            }

            img.setAttribute('data-ironclad-v6-1', 'true');
            img.removeAttribute('data-broken');
        };

        applySrc(myIdx);

        img.onerror = () => {
            const errCount = parseInt(img.getAttribute('data-err') || 0) + 1;
            if (errCount > 5) {
                img.setAttribute('data-broken', 'true');
                return;
            }
            img.setAttribute('data-err', errCount);
            applySrc(myIdx + errCount);
        };
    };

    const fixAll = () => document.querySelectorAll('img').forEach(fixSingle);

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(m => {
            if (m.type === 'attributes' && m.attributeName === 'src') {
                // If AI changes src to something broken/unrelated, caught it
                fixSingle(m.target);
            }
            m.addedNodes.forEach(node => {
                if (node.tagName === 'IMG') fixSingle(node);
                else if (node.querySelectorAll) node.querySelectorAll('img').forEach(fixSingle);
            });
        });
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { 
            fixAll(); 
            observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] }); 
        });
    } else {
        fixAll();
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
    }

    if (window.lucide) window.lucide.createIcons();
    
    // Periodically re-check for any missed images or 404s that just manifested
    setInterval(fixAll, 2500);
})();
`;
