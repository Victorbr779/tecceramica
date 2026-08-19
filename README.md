# Site Tecceramica

Landing page comercial do laboratório de prótese odontológica **Tecceramica**, voltada para
dentistas, clínicas e profissionais da área. Construída em **HTML5 + CSS3 + JavaScript puro
(Vanilla)** — sem frameworks, sem build, sem dependências externas além das fontes do Google Fonts.

Este README explica como editar o site sem precisar entender ferramentas avançadas de
desenvolvimento — só HTML, CSS e JavaScript básico.

## Como abrir o site

Não é necessário instalar nada. Basta abrir o arquivo `index.html` no navegador (duplo clique) ou,
melhor ainda, servir a pasta com um servidor local simples (evita bloqueios de `file://` em alguns
navegadores):

```
# Se tiver Python instalado:
python -m http.server 8000
# depois acesse http://localhost:8000
```

## Estrutura de pastas

```
tecceramica/
├── index.html              → página principal (todo o conteúdo do site)
├── privacy-policy.html     → página de política de privacidade (rascunho, revisar)
├── css/
│   └── style.css           → todo o estilo visual do site
├── js/
│   ├── config.js           → DADOS EDITÁVEIS (whatsapp, telefone, e-mail, endereço, horários...)
│   └── script.js           → comportamento do site (menus, filtros, formulário, etc.)
├── images/
│   ├── logo/                → logotipo
│   └── portfolio/            → fotos reais dos trabalhos
├── favicon/                 → ícone da aba do navegador
├── sitemap.xml               → mapa do site para buscadores
├── robots.txt                 → instruções para buscadores
├── imgs/                       → PASTA ORIGINAL com os arquivos de origem (identidade visual e
│                                  fotos enviadas). Não é usada pelo site — serve como arquivo/backup.
└── prompt/                      → briefing original do projeto (não usado pelo site)
```

## 1. Onde alterar o WhatsApp

Abra `js/config.js` e edite:

```js
whatsappNumber: "5522997754919", // código do país + DDD + número, só dígitos
whatsappMessage: "Sua mensagem padrão aqui",
```

Isso atualiza **automaticamente** todos os botões de WhatsApp do site (header, hero, seções de
serviços, CTA final, botão flutuante e rodapé) — não é preciso editar o HTML em nenhum lugar.
Enquanto esse campo estiver vazio, os botões de WhatsApp ficam desativados (não apontam para um
número inventado). Hoje já está preenchido com `(22) 99775-4919`.

## 2. Onde alterar telefone, e-mail, endereço e horários

Tudo em `js/config.js` — hoje já preenchido com:

```js
phoneDisplay: "(22) 99775-4919",
phoneDial: "+5522997754919",
email: "labrabello@gmail.com",
address: {
  street: "R. Maj. Felix Moreira, 297 - Centro",
  city: "Araruama",
  state: "RJ",
  zip: "28979-102",
},
businessHours: [
  "Segunda a sexta: 08h às 17h",
],
```

Essas informações aparecem automaticamente na seção "Contato" e no rodapé. Se algum desses dados
mudar, atualize também o bloco JSON-LD no `<head>` do `index.html` (ver seção 11 abaixo) — ele é
estático e não é gerado a partir do `config.js`.

### Mapa

O mapa usa o endereço completo da Tecceramica (`address.street` preenchido) automaticamente. Se
`address.street` for esvaziado por algum motivo, o mapa volta a usar `mapQuery` (hoje configurado
como "Araruama, RJ, Brasil", só a cidade) como alternativa.

## 3. Onde alterar redes sociais

Também em `js/config.js` — ainda não preenchido, pois os links reais não foram fornecidos:

```js
social: {
  instagram: "https://instagram.com/seu_usuario",
  facebook: "",
  linkedin: "",
},
```

Deixe em branco (`""`) para ocultar o ícone daquela rede no rodapé.

## 4. Onde adicionar/remover trabalhos do portfólio

1. Coloque a nova foto em `images/portfolio/` (formato `.jpg`, `.jpeg` ou `.webp`, evite arquivos
   muito grandes — o ideal é até ~1500px no lado maior).
2. Em `index.html`, procure a seção `<!-- ===================== PORTFÓLIO ===================== -->`
   e copie um bloco `<figure class="portfolio__item" ...> ... </figure>` inteiro como modelo.
3. Ajuste:
   - `data-category` → uma das categorias existentes (`coroas`, `protocolo`, `total`) ou uma nova
     (nesse caso, adicione também um novo botão de filtro em `.portfolio__filters`).
   - `src` e `data-full` → caminho da nova imagem.
   - `alt` → descrição real da imagem (importante para SEO e acessibilidade).
   - `data-caption` e o texto dentro de `.portfolio__caption` → legenda curta.
4. Para remover um trabalho, apague o bloco `<figure>...</figure>` correspondente.

> ⚠️ A foto `imgs/coroa-4.jpeg` (modelo com o nome do paciente "Vagner" gravado no gesso) foi
> deixada de fora do portfólio por padrão, por conter um dado que identifica um paciente. Só
> adicione essa imagem ao site com autorização, ou depois de recortar a área com o nome.

## 5. Onde alterar depoimentos

> ⚠️ Os 3 depoimentos que estão no site agora são **fictícios**, colocados a pedido para servir de
> modelo visual (nome, foto, clínica e texto de exemplo). Troque-os pelos depoimentos reais antes
> de publicar o site — eles estão claramente marcados com um comentário HTML `FICTÍCIO` acima de
> cada um para não passarem despercebidos.

Para editar, abra `index.html`, procure a seção
`<!-- ===================== DEPOIMENTOS ===================== -->` e, para cada
`<article class="testimonial-card">`, altere:

- O texto dentro de `.testimonial-card__quote` → a fala real do dentista/clínica.
- `.testimonial-card__name` → nome real.
- `.testimonial-card__role` → especialidade e clínica reais.
- `.testimonial-card__avatar` → iniciais do nome real (ou troque por uma foto de verdade, se tiver).

Para adicionar mais depoimentos, copie um bloco `<article class="testimonial-card">` inteiro. Para
remover um, apague o bloco correspondente.

## 6. Onde alterar serviços

Na seção `<!-- ===================== SERVIÇOS ===================== -->` do `index.html`, cada
serviço é um bloco `<article class="service-card">`. A lista atual foi montada a partir dos tipos
de trabalho comprovados nas fotos reais recebidas (coroas em E-max, cerômero, dissilicato de
lítio, protocolo sobre implante, provisório CAD/CAM e prótese total). Revise títulos e descrições
para confirmar se refletem exatamente os serviços que a Tecceramica quer divulgar, e ajuste a
`data-whatsapp-message` de cada botão se quiser uma mensagem diferente por serviço.

## 7. Onde trocar imagens

- **Logo:** troque o arquivo `images/logo/logo-tecceramica.jpg` por um novo com o mesmo nome (ou
  atualize os caminhos `src="images/logo/..."` em `index.html` se usar outro nome de arquivo).
- **Foto do Hero (banner principal):** é a imagem em `.hero__media-frame img`, dentro da seção
  `<section class="hero" id="inicio">`.
- **Favicon:** hoje é um ícone SVG provisório com o monograma "TC" (`favicon/favicon.svg`), feito à
  mão por não termos o arquivo vetorial oficial do logo. Assim que houver uma versão oficial em
  SVG ou PNG de alta resolução, gere um novo conjunto de favicons (por exemplo, em
  https://realfavicongenerator.net) e substitua os arquivos em `favicon/`.

## 8. Onde alterar cores

Todas as cores da marca estão centralizadas no topo de `css/style.css`, dentro de `:root`:

```css
:root {
  --color-primary: #0B1F3A;    /* azul-marinho principal */
  --color-secondary: #1E3A5F;  /* azul secundário */
  --color-accent: #2F80ED;     /* azul de destaque (CTAs, links) */
  --color-bg-light: #F2F4F7;   /* cinza claro de fundo */
  --color-white: #FFFFFF;
  ...
}
```

Alterar um valor aqui muda a cor em **todo o site** automaticamente.

## 9. Onde alterar textos

Todo o conteúdo textual (headline do hero, diferenciais, descrições de serviços, etc.) está
diretamente no `index.html`, dentro de cada seção comentada (`<!-- ===== NOME DA SEÇÃO ===== -->`).
Edite o texto entre as tags normalmente, sem mexer nas classes (`class="..."`) nem nos atributos
(`data-...`, `id="..."`), que controlam o estilo e o comportamento.

## 10. Formulário de contato

O formulário (`#contato`) valida os campos no navegador (nome, WhatsApp e mensagem são
obrigatórios). Como o site ainda não tem um backend:

- Se `siteConfig.formEndpoint` (em `js/config.js`) estiver **vazio**, ao enviar um formulário
  válido o site abre o WhatsApp configurado com os dados preenchidos prontos para envio.
- Quando você tiver um backend, serviço de formulários ou API para receber os leads, preencha
  `formEndpoint` com a URL do endpoint em `js/config.js` — o formulário passará a enviar os dados
  por `fetch` em formato JSON automaticamente, sem precisar mexer no restante do código.

## 11. SEO — o que ainda precisa ser confirmado

- O domínio usado nas tags `canonical`, Open Graph e no `sitemap.xml` é um placeholder
  (`https://www.tecceramica.com.br/`), pois ainda não foi confirmado um domínio oficial. Assim que
  ele for definido, atualize todas as ocorrências em `index.html`, `privacy-policy.html`,
  `sitemap.xml` e `robots.txt`.
- O bloco de dados estruturados (JSON-LD, no `<head>` do `index.html`) já está preenchido com
  telefone, endereço completo, e-mail e horário reais. Esse bloco é **estático** (não é gerado a
  partir do `config.js`) — se qualquer um desses dados mudar no futuro, atualize os dois lugares.

## 12. Itens pendentes (não inventados de propósito)

Estes campos ainda estão como placeholder em `js/config.js` porque a informação real não foi
fornecida. O site funciona normalmente sem eles (mostra avisos como "em breve" ou oculta o ícone),
mas o ideal é preenchê-los assim que possível:

- `social.instagram`, `social.facebook`, `social.linkedin`
- `cnpj`
- Lista oficial de serviços (seção "Serviços" — hoje baseada nas fotos de portfólio recebidas)
- Depoimentos reais de dentistas/clínicas parceiras (os 3 que estão no site são **fictícios**, ver
  seção 5 acima)

## Dependências externas

A única dependência externa é o **Google Fonts** (famílias Montserrat e Inter, carregadas via
`<link>` no `<head>` de cada página), usada porque é a tipografia oficial do manual de marca da
Tecceramica. Caso fique indisponível, o navegador usa automaticamente a fonte de sistema definida
como alternativa (`--font-heading` e `--font-body` em `css/style.css` já incluem *fallbacks*), e o
site continua funcionando normalmente, só com uma tipografia levemente diferente.

Nenhuma outra biblioteca, framework ou serviço externo é utilizado.
