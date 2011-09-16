/**
* jQuery Rollover Plugin
* Version 1.2.3
* Copyright (c) Hideki Abe
* 
* This JavaScript referred to "mjl.js" provided by Mitsue-Links Co., Ltd.
* (@source: http://www.mitsue.co.jp/service/produce/mjl.html)
*
* Licensed under the GNU General Public License.
*/
(function($) {
    var namespace = "rollover";
    $.fn[namespace] = function(option) {
        // オプションのマージ
        var settings = $.extend({}, $.fn[namespace].defaults, option);
        
        // 変数宣言
        var cache = {},
            transactRoot;
        
        // 対象要素の各種情報
        var TYPES = {
            img: {
                types: ["mouseover", "mouseout"],
                haveDescendants: false,
                collect: function($parent) {
                    if($parent[0].tagName.toLowerCase() === "img") {
                        return $parent.get();
                    } else {
                        return $parent.find("img").get();
                    }
                }
            },
            a: {
                types: ["focus", "blur"],
                haveDescendants: true,
                collect: function($parent) {
                    if($parent[0].tagName.toLowerCase() === "a") {
                        return $parent.get();
                    } else {
                        return $parent.find("a").get();
                    }
                }
            },
            input: {
                types: ["mouseover", "mouseout", "focus", "blur"],
                haveDescendants: false,
                collect: function($parent) {
                    if($parent[0].tagName.toLowerCase() === "input" && 
                       $parent.attr("type") === "image") {
                        return $parent.get();
                    } else {
                        return $parent.find("input[type=image]").get();
                    }
                }
            }
        };
        
        // イベントと状態のマッピング
        var EVENT2STATUS = {
            mouseover: "on",
            mouseout: "off",
            focus: "on",
            blur: "off"
        };
        
        // 子孫要素の収集（a要素の子孫にあたるimg要素）
        function getDescendants($parent) {
            return $parent.find("img");
        }
        
        // 処理ルートと同一ノードかの判定
        function isSameNode($elem) {
            if($elem[0] === transactRoot) {
                return true;
            } else {
                return false;
            }
        }
        
        // 処理対象外要素の判断
        function isEnable(target) {
            var $target = $(target),
                name = target.tagName.toLowerCase(),
                $elem;
            
            $elem = (name === "img" || name === "input" ? $target : getDescendants($target));
            while (!isSameNode($elem)) {    // Bug?: while条件文内でノードの判定をすると、それ以後の処理が不正となる。
                if($elem.hasClass(settings.disable.replace(/^\./, ""))) {
                    // .unroll該当
                    return false;
                }
                $elem = $elem.parent();
            }
            // .unroll該当なし
            return true;
        }
        
        // 処理対象要素のフィルタリング
        function filter(targets) {
            var i,
                nTargets = targets.length,
                ret = [];
            
            for(i = 0; i < nTargets; i++) {
                if(isEnable(targets[i])) {
                    ret.push(targets[i]);
                }
            }
            return ret;
        }
        
        // 処理対象要素の収集
        function collectTargets($parent) {
            var t,
                targets = [],
                ret;
            
            for(t in TYPES) {
                targets = targets.concat(TYPES[t].collect.call(this, $parent));
            }
            ret = filter(targets);
            return ret;
        }
        
        // ロールオーバーに関するデータをセット
        function setData(targets) {
            var i,
                nTargets = targets.length,
                $target,
                name,
                $img,
                src;
            
            // collectTargets()で収集した要素に含まれるimg要素にデータをセットする
            for(i = 0; i < nTargets; i++) {
                $target = $(targets[i]);
                name = targets[i].tagName.toLocaleLowerCase();
                $img = TYPES[name].haveDescendants ? getDescendants($target) : $target;
                obj = $img.data(namespace);
                if(!obj) {    // objがundefinedでなければデータのセット済み
                    src = $img.attr("src");
                    $img.data(namespace, {
                        // normalSrc: 通常時の画像パス
                        // hoverSrc: ロールオーバー時の画像パス
                        normalSrc: src,
                        hoverSrc: src.replace(settings.replaceCond, settings.replaceStr)
                    });
                    
                    // キャッシュを作成
                    addCache(src.replace(settings.replaceCond, settings.replaceStr))
                }
            }
        }
        
        // イベントの設定
        function setEvents(targets) {
            var i,
                nTargets = targets.length,
                target,
                name,
                haveDescendants,
                eventTypes,
                j,
                nEventTypes;
            
            // collectTargets()で収集した要素にイベントをバインドする
            for(i = 0; i < nTargets; i++) {
                target = targets[i];
                name = target.tagName.toLocaleLowerCase();
                haveDescendants = TYPES[name].haveDescendants;
                eventTypes = TYPES[name].types;
                nEventTypes = eventTypes.length;
                
                // 指定されたイベントを全てバインドしていく
                for(j = 0; j < nEventTypes; j++) {
                    $(target).bind(eventTypes[j], function(event) {
                        var elem = event.target,
                            haveDescendants,
                            $img;
                        
                        haveDescendants = TYPES[elem.tagName.toLocaleLowerCase()].haveDescendants;
                        $img = haveDescendants ? getDescendants($(elem)) : $(elem);
                        change(event, $img);
                    });
                }
            }
        }
        
        // ロールオーバー処理
        function change(event, $img) {
            var obj = $img.data(namespace);
            
            if(EVENT2STATUS[event.type] === "on") {
                $img.attr("src", obj.hoverSrc);
                obj.status = "on";
            } else if(EVENT2STATUS[event.type] === "off") {
                $img.attr("src", obj.normalSrc);
                obj.status = "off";
            }
        }
        
        // キャッシュ生成
        function addCache(src) {
            var img = cache[src];
            
            if(!img) {
                cache[src] = img = new Image();
                img.src = src;
            }
        }
        
        // プラグイン処理開始
        return this.each(function(index, element) {
            var targets;
            
            transactRoot = element;
            targets = collectTargets($(this));    // 戻り値は通常の配列
            setData(targets);
            setEvents(targets);
        });
    };
    
    $.fn[namespace].defaults = {
        disable: ".unroll",             // ロールオーバー処理対象から外すclass属性名
        replaceCond: /(\.[^\.]+)$/,     // 画像URIの文字列検索条件
        replaceStr: "_o$1"              // 画像URIの文字列置換条件
    };
}(jQuery));
