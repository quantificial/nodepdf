const { PDFDocument, StandardFonts, TextAlignment } = require("pdf-lib");
const { writeFileSync,readFileSync } = require("fs");
var path = require('path');
const fontkit = require("@pdf-lib/fontkit");

async function createPdf() {
  const pdfDoc = await PDFDocument.load(readFileSync("./test_ca_2.pdf"));
  pdfDoc.registerFontkit(fontkit);

  const fontpath = path.join(__dirname,"/fonts", 'NotoSansTC-Regular.otf')
    console.log(fontpath);

  const fontBytes = readFileSync(fontpath);
  const customFont = await pdfDoc.embedFont(fontBytes);

  //const pdfDoc = await PDFDocument.create()
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

  //const page = pdfDoc.addPage()
  const page = pdfDoc.getPage(0);

  page.drawText("丈蚪宦尬丈蚪尬蚪瘁尬蚪", {
    x: 40,
    y: 450,
    size: 20,
    font: customFont,
    //textHeight: 40
    //color: rgb(0, 0.53, 0.71),
  })

  //text_a
  const form = pdfDoc.getForm();
  const textField = form.getTextField('text_a');
  textField.setFontSize(10);
  //const newDa = da + '\n' + setFontAndSize('Courier', 8).toString();
  //textField.acroField.setFontSize(10);
  textField.setText('測試中文字 Name: Message:');
  textField.updateAppearances(customFont);

  //form.updateFieldAppearances();
  form.flatten();

  const text = "Hello World";
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const textWidth = helveticaFont.widthOfTextAtSize(text, 24);
  const textHeight = helveticaFont.heightAtSize(24);

  page.drawText(text, {
    x: page.getWidth() / 2 - textWidth / 2,
    y: page.getHeight() / 2 - textHeight / 2,
  });

  const pdfBytes = await pdfDoc.save()

  writeFileSync("o.pdf", pdfBytes);
}

createPdf();
