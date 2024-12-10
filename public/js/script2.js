"use strict";
var animator = (() => {
    var $ = Object.defineProperty;
    var Ae = Object.getOwnPropertyDescriptor;
    var he = Object.getOwnPropertyNames;
    var we = Object.prototype.hasOwnProperty;
    var Te = (e, t) => {
            for (var n in t) $(e, n, {
                get: t[n],
                enumerable: !0
            })
        },
        Me = (e, t, n, o) => {
            if (t && typeof t == "object" || typeof t == "function")
                for (let f of he(t)) !we.call(e, f) && f !== n && $(e, f, {
                    get: () => t[f],
                    enumerable: !(o = Ae(t, f)) || o.enumerable
                });
            return e
        };
    var be = e => Me($({}, "__esModule", {
        value: !0
    }), e);
    var He = {};
    Te(He, {
        animateAppearEffects: () => xe,
        getActiveVariantHash: () => ge,
        spring: () => k,
        startOptimizedAppearAnimation: () => j
    });
    var _ = e => e.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase();
    var B = "framerAppearId",
        H = "data-" + _(B);
    var K = e => e;
    var U = K;
    var ve = ["transformPerspective", "x", "y", "z", "translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skew", "skewX", "skewY"],
        Q = new Set(ve);
    var z = (e, t, n) => n > t ? t : n < e ? e : n;
    var O = e => e * 1e3,
        S = e => e / 1e3;

    function J(e, t) {
        return t ? e * (1e3 / t) : 0
    }
    var Oe = 5;

    function ee(e, t, n) {
        let o = Math.max(t - Oe, 0);
        return J(n - e(o), t - o)
    }
    var R = .001,
        Se = .01,
        te = 10,
        ke = .05,
        Pe = 1;

    function ne({
        duration: e = 800,
        bounce: t = .25,
        velocity: n = 0,
        mass: o = 1
    }) {
        let f, r;
        U(e <= O(te), "Spring duration must be 10 seconds or less");
        let i = 1 - t;
        i = z(ke, Pe, i), e = z(Se, te, S(e)), i < 1 ? (f = a => {
            let p = a * i,
                c = p * e,
                u = p - n,
                l = V(a, i),
                d = Math.exp(-c);
            return R - u / l * d
        }, r = a => {
            let c = a * i * e,
                u = c * n + n,
                l = Math.pow(i, 2) * Math.pow(a, 2) * e,
                d = Math.exp(-c),
                g = V(Math.pow(a, 2), i);
            return (-f(a) + R > 0 ? -1 : 1) * ((u - l) * d) / g
        }) : (f = a => {
            let p = Math.exp(-a * e),
                c = (a - n) * e + 1;
            return -R + p * c
        }, r = a => {
            let p = Math.exp(-a * e),
                c = (n - a) * (e * e);
            return p * c
        });
        let m = 5 / e,
            s = Ie(f, r, m);
        if (e = O(e), isNaN(s)) return {
            stiffness: 100,
            damping: 10,
            duration: e
        };
        {
            let a = Math.pow(s, 2) * o;
            return {
                stiffness: a,
                damping: i * 2 * Math.sqrt(o * a),
                duration: e
            }
        }
    }
    var De = 12;

    function Ie(e, t, n) {
        let o = n;
        for (let f = 1; f < De; f++) o = o - e(o) / t(o);
        return o
    }

    function V(e, t) {
        return e * Math.sqrt(1 - t * t)
    }
    var Ke = ["duration", "bounce"],
        Ve = ["stiffness", "damping", "mass"];

    function oe(e, t) {
        return t.some(n => e[n] !== void 0)
    }

    function Ce(e) {
        let t = {
            velocity: 0,
            stiffness: 100,
            damping: 10,
            mass: 1,
            isResolvedFromDuration: !1,
            ...e
        };
        if (!oe(e, Ve) && oe(e, Ke)) {
            let n = ne(e);
            t = {
                ...t,
                ...n,
                mass: 1
            }, t.isResolvedFromDuration = !0
        }
        return t
    }

    function k({
        keyframes: e,
        restDelta: t,
        restSpeed: n,
        ...o
    }) {
        let f = e[0],
            r = e[e.length - 1],
            i = {
                done: !1,
                value: f
            },
            {
                stiffness: m,
                damping: s,
                mass: a,
                duration: p,
                velocity: c,
                isResolvedFromDuration: u
            } = Ce({
                ...o,
                velocity: -S(o.velocity || 0)
            }),
            l = c || 0,
            d = s / (2 * Math.sqrt(m * a)),
            g = r - f,
            y = S(Math.sqrt(m / a)),
            T = Math.abs(g) < 5;
        n || (n = T ? .01 : 2), t || (t = T ? .005 : .5);
        let h;
        if (d < 1) {
            let x = V(y, d);
            h = A => {
                let M = Math.exp(-d * y * A);
                return r - M * ((l + d * y * g) / x * Math.sin(x * A) + g * Math.cos(x * A))
            }
        } else if (d === 1) h = x => r - Math.exp(-y * x) * (g + (l + y * g) * x);
        else {
            let x = y * Math.sqrt(d * d - 1);
            h = A => {
                let M = Math.exp(-d * y * A),
                    I = Math.min(x * A, 300);
                return r - M * ((l + d * y * g) * Math.sinh(I) + x * g * Math.cosh(I)) / x
            }
        }
        return {
            calculatedDuration: u && p || null,
            next: x => {
                let A = h(x);
                if (u) i.done = x >= p;
                else {
                    let M = 0;
                    d < 1 && (M = x === 0 ? O(l) : ee(h, x, A));
                    let I = Math.abs(M) <= n,
                        ye = Math.abs(r - A) <= t;
                    i.done = I && ye
                }
                return i.value = i.done ? r : A, i
            }
        }
    }
    var re = e => Array.isArray(e) && typeof e[0] == "number";
    var P = ([e, t, n, o]) => `cubic-bezier(${e}, ${t}, ${n}, ${o})`,
        ie = {
            linear: "linear",
            ease: "ease",
            easeIn: "ease-in",
            easeOut: "ease-out",
            easeInOut: "ease-in-out",
            circIn: P([0, .65, .55, 1]),
            circOut: P([.55, 0, 1, .45]),
            backIn: P([.31, .01, .66, -.59]),
            backOut: P([.33, 1.53, .69, .99])
        };

    function Ee(e) {
        return L(e) || ie.easeOut
    }

    function L(e) {
        if (e) return re(e) ? P(e) : Array.isArray(e) ? e.map(Ee) : ie[e]
    }

    function X(e, t, n, {
        delay: o = 0,
        duration: f = 300,
        repeat: r = 0,
        repeatType: i = "loop",
        ease: m,
        times: s
    } = {}) {
        let a = {
            [t]: n
        };
        s && (a.offset = s);
        let p = L(m);
        return Array.isArray(p) && (a.easing = p), e.animate(a, {
            delay: o,
            duration: f,
            easing: Array.isArray(p) ? "linear" : p,
            fill: "both",
            iterations: r + 1,
            direction: i === "reverse" ? "alternate" : "normal"
        })
    }

    function se(e) {
        return e.props[H]
    }
    var b = (e, t) => {
        let n = Q.has(t) ? "transform" : t;
        return `${e}: ${n}`
    };
    var w = new Map,
        Y = new Set;

    function F(e, t, n) {
        let o = b(e, t),
            f = w.get(o);
        if (!f) return null;
        let {
            animation: r,
            startTime: i
        } = f;

        function m() {
            var s;
            (s = window.MotionCancelOptimisedAnimation) === null || s === void 0 || s.call(window, e, t, n)
        }
        return r.onfinish = m, i === null || window.MotionHandoffIsComplete ? (m(), null) : i
    }
    var C, v, N = new Set;

    function $e() {
        N.forEach(e => {
            e.animation.play(), e.animation.startTime = e.startTime
        }), N.clear()
    }

    function j(e, t, n, o, f) {
        if (window.MotionHandoffIsComplete) {
            window.MotionHandoffAnimation = void 0;
            return
        }
        let r = e.dataset[B];
        if (!r) return;
        window.MotionHandoffAnimation = F;
        let i = b(r, t);
        v || (v = X(e, t, [n[0], n[0]], {
            duration: 1e4,
            ease: "linear"
        }), w.set(i, {
            animation: v,
            startTime: null
        }), window.MotionHandoffAnimation = F, window.MotionHasOptimisedAnimation = (s, a) => {
            if (!s) return !1;
            if (!a) return Y.has(s);
            let p = b(s, a);
            return !!w.get(p)
        }, window.MotionCancelOptimisedAnimation = (s, a, p, c) => {
            let u = b(s, a),
                l = w.get(u);
            l && (p && c === void 0 ? p.postRender(() => {
                p.postRender(() => {
                    l.animation.cancel()
                })
            }) : l.animation.cancel(), p && c ? (N.add(l), p.render($e)) : (w.delete(u), w.size || (window.MotionCancelOptimisedAnimation = void 0)))
        }, window.MotionCheckAppearSync = (s, a, p) => {
            var c, u;
            let l = se(s);
            if (!l) return;
            let d = (c = window.MotionHasOptimisedAnimation) === null || c === void 0 ? void 0 : c.call(window, l, a),
                g = (u = s.props.values) === null || u === void 0 ? void 0 : u[a];
            if (!d || !g) return;
            let y = p.on("change", T => {
                var h;
                g.get() !== T && ((h = window.MotionCancelOptimisedAnimation) === null || h === void 0 || h.call(window, l, a), y())
            });
            return y
        });
        let m = () => {
            v.cancel();
            let s = X(e, t, n, o);
            C === void 0 && (C = performance.now()), s.startTime = C, w.set(i, {
                animation: s,
                startTime: C
            }), f && f(s)
        };
        Y.add(r), v.ready ? v.ready.then(m).catch(K) : m()
    }
    var G = ["transformPerspective", "x", "y", "z", "translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "rotate", "rotateX", "rotateY", "rotateZ", "skew", "skewX", "skewY"],
        Be = {
            x: "translateX",
            y: "translateY",
            z: "translateZ",
            transformPerspective: "perspective"
        },
        ze = {
            translateX: "px",
            translateY: "px",
            translateZ: "px",
            x: "px",
            y: "px",
            z: "px",
            perspective: "px",
            transformPerspective: "px",
            rotate: "deg",
            rotateX: "deg",
            rotateY: "deg"
        };

    function ae(e, t) {
        let n = ze[e];
        return !n || typeof t == "string" && t.endsWith(n) ? t : `${t}${n}`
    }

    function W(e) {
        return G.includes(e)
    }
    var Re = (e, t) => G.indexOf(e) - G.indexOf(t);

    function pe({
        transform: e,
        transformKeys: t
    }, n) {
        let o = {},
            f = !0,
            r = "";
        t.sort(Re);
        for (let i of t) {
            let m = e[i],
                s = !0;
            typeof m == "number" ? s = m === (i.startsWith("scale") ? 1 : 0) : s = parseFloat(m) === 0, s || (f = !1, r += `${Be[i]||i}(${e[i]}) `), n && (o[i] = e[i])
        }
        return r = r.trim(), n ? r = n(o, r) : f && (r = "none"), r
    }

    function Z(e, t) {
        let n = new Set(Object.keys(e));
        for (let o in t) n.add(o);
        return Array.from(n)
    }

    function q(e, t) {
        let n = t - e.length;
        if (n <= 0) return e;
        let o = new Array(n).fill(e[e.length - 1]);
        return e.concat(o)
    }

    function D(e) {
        return e * 1e3
    }
    var ce = {
            duration: .001
        },
        E = {
            opacity: 1,
            scale: 1,
            translateX: 0,
            translateY: 0,
            translateZ: 0,
            x: 0,
            y: 0,
            z: 0,
            rotate: 0,
            rotateX: 0,
            rotateY: 0
        };

    function ue(e, t, n, o, f) {
        return n.delay && (n.delay = D(n.delay)), n.type === "spring" ? Xe(e, t, n, o, f) : Fe(e, t, n, o, f)
    }

    function Le(e, t, n) {
        let o = {},
            f = 0,
            r = 0;
        for (let i of Z(e, t)) {
            let m = e[i] ?? E[i],
                s = t[i] ?? E[i];
            if (m === void 0 || s === void 0 || i !== "transformPerspective" && m === s) continue;
            i === "transformPerspective" && (o[i] = [m, s]);
            let a = Ze(m, s, n),
                {
                    duration: p,
                    keyframes: c
                } = a;
            p === void 0 || c === void 0 || (p > f && (f = p, r = c.length), o[i] = c)
        }
        return {
            keyframeValuesByProps: o,
            longestDuration: f,
            longestLength: r
        }
    }

    function Xe(e, t, n, o, f) {
        let r = {},
            {
                keyframeValuesByProps: i,
                longestDuration: m,
                longestLength: s
            } = Le(e, t, n);
        if (!s) return r;
        let a = {
                ease: "linear",
                duration: m,
                delay: n.delay
            },
            p = f ? ce : a,
            c = {};
        for (let [l, d] of Object.entries(i)) W(l) ? c[l] = q(d, s) : r[l] = {
            keyframes: q(d, s),
            options: l === "opacity" ? a : p
        };
        let u = de(c, o);
        return u && (r.transform = {
            keyframes: u,
            options: p
        }), r
    }

    function Ye(e) {
        let {
            type: t,
            duration: n,
            ...o
        } = e;
        return {
            duration: D(n),
            ...o
        }
    }

    function Fe(e, t, n, o, f) {
        let r = Ye(n);
        if (!r) return;
        let i = {},
            m = f ? ce : r,
            s = {};
        for (let p of Z(e, t)) {
            let c = e[p] ?? E[p],
                u = t[p] ?? E[p];
            c === void 0 || u === void 0 || p !== "transformPerspective" && c === u || (W(p) ? s[p] = [c, u] : i[p] = {
                keyframes: [c, u],
                options: p === "opacity" ? r : m
            })
        }
        let a = de(s, o);
        return a && (i.transform = {
            keyframes: a,
            options: m
        }), i
    }
    var Ne = ["duration", "bounce"],
        je = ["stiffness", "damping", "mass"];

    function le(e) {
        return je.some(t => t in e) ? !1 : Ne.some(t => t in e)
    }

    function Ge(e, t, n) {
        return le(n) ? `${e}-${t}-${n.duration}-${n.bounce}` : `${e}-${t}-${n.damping}-${n.stiffness}-${n.mass}`
    }

    function We(e) {
        return le(e) ? {
            ...e,
            duration: D(e.duration)
        } : e
    }
    var fe = new Map,
        me = 10;

    function Ze(e, t, n) {
        let o = Ge(e, t, n),
            f = fe.get(o);
        if (f) return f;
        let r = [e, t],
            i = k({
                ...We(n),
                keyframes: r
            }),
            m = {
                done: !1,
                value: r[0]
            },
            s = [],
            a = 0;
        for (; !m.done && a < D(10);) m = i.next(a), s.push(m.value), a += me;
        r = s;
        let p = a - me,
            u = {
                keyframes: r,
                duration: p,
                ease: "linear"
            };
        return fe.set(o, u), u
    }

    function de(e, t) {
        let n = [],
            o = Object.values(e)[0]?.length;
        if (!o) return;
        let f = Object.keys(e);
        for (let r = 0; r < o; r++) {
            let i = {};
            for (let [s, a] of Object.entries(e)) {
                let p = a[r];
                p !== void 0 && (i[s] = ae(s, p))
            }
            let m = pe({
                transform: i,
                transformKeys: f
            }, t);
            n.push(m)
        }
        return n
    }

    function qe(e, t) {
        if (!t)
            for (let n in e) {
                let o = e[n];
                return o?.legacy === !0 ? o : void 0
            }
    }

    function xe(e, t, n, o, f, r) {
        for (let [i, m] of Object.entries(e)) {
            let s = r ? m[r] : void 0;
            if (s === null || !s && m.default === null) continue;
            let a = s ?? m.default ?? qe(m, r);
            if (!a) continue;
            let {
                initial: p,
                animate: c,
                transformTemplate: u
            } = a;
            if (!p || !c) continue;
            let {
                transition: l,
                ...d
            } = c, g = ue(p, d, l, _e(u, o), f);
            if (!g) continue;
            let y = {},
                T = {};
            for (let [x, A] of Object.entries(g)) y[x] = A.keyframes, T[x] = A.options;
            let h = r ? `:not(.hidden-${r}) ` : "";
            t(`${h}[${n}="${i}"]`, y, T)
        }
    }

    function _e(e, t) {
        if (!(!e || !t)) return (n, o) => e.replace(t, o)
    }

    function ge(e) {
        return e ? e.find(n => n.mediaQuery ? window.matchMedia(n.mediaQuery).matches === !0 : !1)?.hash : void 0
    }
    return be(He);
})();