const loadImage = async (url: string): Promise<HTMLImageElement> => {
  const img = document.createElement('img')
  img.src = url
  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img)
    img.onerror = reject
  })
}

export const downloadImage = async (svg: SVGElement, format: string) => {
  const svgAsXML = new XMLSerializer().serializeToString(svg)
  const svgData = `data:image/svg+xml,${encodeURIComponent(svgAsXML)}`
  const img = await loadImage(svgData)
  const canvas = document.createElement('canvas') as HTMLCanvasElement
  canvas.width = svg.clientWidth
  canvas.height = svg.clientHeight
  canvas.getContext('2d')!.drawImage(img, 0, 0, svg.clientWidth, svg.clientHeight)
  canvas.toBlob((blob) => {
    const file = new File([blob!], "domain-diagram.png", { type: "octet/stream" });
    const url = window.URL.createObjectURL(file);
    window.location.assign(url);
  }, `image/${format}`)
}

export const downloadSVGImage = async (svg: SVGElement) => {
  const svgAsXML = new XMLSerializer().serializeToString(svg)
  const file = new File([svgAsXML], "domain-diagram.svg", { type: "octet/stream" });
  const url = window.URL.createObjectURL(file);
  window.location.assign(url);
}

export const downloadJSON = async (state: any) => {
  const json = JSON.stringify(state, null, 2)
  const file = new File([json], "domain-diagram.json", { type: "octet/stream" });
  const url = window.URL.createObjectURL(file);
  window.location.assign(url);
}
