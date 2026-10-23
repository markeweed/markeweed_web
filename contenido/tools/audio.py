"""Música ambiente sin voz + FX sintetizados (sin samples externos)."""
import wave
import numpy as np

SR = 44100
rng = np.random.default_rng(7)


def onepole(x, a):
    """Paso bajo de un polo; `a` puede ser escalar o array (0..1, mayor = más brillo)."""
    y = np.empty_like(x); s = 0.0
    av = np.broadcast_to(a, x.shape)
    for i in range(len(x)):
        s += av[i] * (x[i] - s); y[i] = s
    return y


def cutoff_a(fc):
    return 1 - np.exp(-2 * np.pi * np.asarray(fc) / SR)


def reverb(x, secs=2.6, mix=.35, seed=1):
    r = np.random.default_rng(seed)
    n = int(secs * SR)
    ir = r.normal(0, 1, n) * np.exp(-np.linspace(0, 7, n))
    ir = onepole(ir, cutoff_a(5000)); ir /= np.sqrt((ir ** 2).sum())
    L = len(x) + n
    N = 1 << (L - 1).bit_length()
    wet = np.fft.irfft(np.fft.rfft(x, N) * np.fft.rfft(ir, N), N)[:len(x)]
    return x * (1 - mix) + wet * mix


def note(m):
    return 440 * 2 ** ((m - 69) / 12)


def pad(dur, chords, bpm=92):
    n = int(dur * SR); t = np.arange(n) / SR
    out = np.zeros(n)
    seg = dur / len(chords)
    for ci, ch in enumerate(chords):
        a, b = int(ci * seg * SR), int(min((ci + 1) * seg + 1.2, dur) * SR)
        tt = t[a:b] - t[a]
        env = np.minimum(1, tt / 0.9) * np.minimum(1, (tt[-1] - tt) / 1.0 + 1e-9).clip(0, 1)
        for m in ch:
            for det in (-0.07, 0.0, 0.08):
                f = note(m + det)
                ph = rng.uniform(0, 2 * np.pi)
                w = np.sin(2 * np.pi * f * tt + ph) + 0.3 * np.sin(4 * np.pi * f * tt + ph) + 0.12 * np.sin(6 * np.pi * f * tt)
                out[a:b] += w * env * 0.05
    lfo = 1400 + 900 * np.sin(2 * np.pi * 0.09 * t)
    out = onepole(out, cutoff_a(lfo))
    # pulso suave (kick sordo + hat de ruido) para dar ritmo sin protagonismo
    beat = 60 / bpm
    k = np.zeros(n)
    for i in range(int(dur / beat)):
        s = int(i * beat * SR); L = int(.35 * SR)
        if s + L > n: break
        tt = np.arange(L) / SR
        f = 48 + 70 * np.exp(-tt * 28)
        k[s:s + L] += np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9) * .5
        # sidechain al pad
        out[s:s + L] *= 1 - .35 * np.exp(-tt * 7)
        hs = int((i + .5) * beat * SR); HL = int(.06 * SR)
        if hs + HL < n:
            hn = rng.normal(0, 1, HL); hn = hn - onepole(hn, cutoff_a(6000))
            k[hs:hs + HL] += hn * np.exp(-np.arange(HL) / SR * 70) * .05
    vinyl = onepole(rng.normal(0, 1, n), cutoff_a(3000)) * .006
    return out + k * .55 + vinyl


def fx_impact():
    L = int(1.2 * SR); tt = np.arange(L) / SR
    f = 30 + 110 * np.exp(-tt * 6)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 3.2)
    nz = onepole(rng.normal(0, 1, L), cutoff_a(1800)) * np.exp(-tt * 14) * 1.4
    return (s * .9 + nz * .5)


def fx_whoosh(dur=.55, up=True):
    L = int(dur * SR); tt = np.linspace(0, 1, L)
    env = np.sin(np.pi * tt) ** 2
    fc = (400 + 5200 * tt) if up else (5600 - 5200 * tt)
    nz = rng.normal(0, 1, L)
    lp = onepole(nz, cutoff_a(fc)); bp = lp - onepole(lp, cutoff_a(fc * .35))
    return bp * env * 1.6


def fx_pop(freq=880, dur=.09):
    L = int(dur * SR); tt = np.arange(L) / SR
    f = freq * (1 + .6 * np.exp(-tt * 60))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 45) * .45


def fx_tick():
    return fx_pop(1650, .06) * .8 + fx_pop(2470, .06) * .4


def fx_riser(dur=1.4):
    L = int(dur * SR); tt = np.linspace(0, 1, L)
    nz = rng.normal(0, 1, L)
    lp = onepole(nz, cutoff_a(300 + 7000 * tt ** 2))
    tone = np.sin(2 * np.pi * np.cumsum(220 + 660 * tt ** 2) / SR) * .15
    return (lp * .7 + tone) * tt ** 2.2


def fx_shimmer(dur=1.8):
    L = int(dur * SR); tt = np.arange(L) / SR
    out = np.zeros(L)
    for m in (88, 91, 95, 100):
        out += np.sin(2 * np.pi * note(m) * tt) * np.exp(-tt * 2.2) * .08
    return out


def fx_glitch(dur=.25):
    L = int(dur * SR)
    sq = np.sign(np.sin(2 * np.pi * np.cumsum(rng.choice([180, 320, 760, 1200], L // 400 + 1).repeat(400)[:L]) / SR))
    return sq * .12 * (rng.random(L) > .3)


FX = {'impact': fx_impact, 'whoosh': fx_whoosh, 'whoosh_down': lambda: fx_whoosh(.5, False), 'pop': fx_pop,
      'pop_lo': lambda: fx_pop(520, .11), 'pop_hi': lambda: fx_pop(1320, .07), 'tick': fx_tick, 'riser': fx_riser,
      'shimmer': fx_shimmer, 'glitch': fx_glitch}


def render(path, dur, chords, events, bpm=92):
    music = pad(dur, chords, bpm)
    fx = np.zeros_like(music)
    for t, kind, *g in events:
        s = FX[kind]()
        a = int(t * SR); b = min(a + len(s), len(fx))
        if a < len(fx):
            fx[a:b] += s[:b - a] * (g[0] if g else 1)
    music = reverb(music, 3.0, .4, 2)
    fxr = reverb(fx, 1.4, .22, 3)
    n = len(music)
    # paneo estéreo ligero
    tt = np.arange(n) / SR
    pan = .5 + .12 * np.sin(2 * np.pi * .07 * tt)
    L = music * (1 - pan) * 1.4 + fxr * .9
    R = music * pan * 1.4 + fxr * .9
    st = np.stack([L, R], 1)
    fade = np.ones(n); fo = int(1.0 * SR); fade[-fo:] = np.linspace(1, 0, fo); fade[:int(.03 * SR)] = np.linspace(0, 1, int(.03 * SR))
    st *= fade[:, None]
    st /= np.abs(st).max() / 0.89
    pcm = (np.tanh(st * 1.1) / np.tanh(1.1) * 32000).astype(np.int16)
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
