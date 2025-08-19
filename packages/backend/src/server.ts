import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import { z } from "zod";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const UrlSchema = z.object({
  original: z.string().url(),
  expiresAt: z.string().optional(),
});

app.post("/urls", async (req, res) => {
  try {
    const { original, expiresAt } = UrlSchema.parse(req.body);
    const shortId = nanoid(8);
    const qrCodeDataUrl = await QRCode.toDataURL(original);

    const url = await prisma.url.create({
      data: {
        original,
        shortId,
        qrCode: qrCodeDataUrl,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    res.json(url);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;
  const url = await prisma.url.findUnique({ where: { shortId } });
  if (!url) return res.status(404).send("URL não encontrada");

  if (url.expiresAt && url.expiresAt < new Date()) {
    return res.status(410).send("URL expirada");
  }

  await prisma.url.update({
    where: { shortId },
    data: { clicks: { increment: 1 } },
  });

  res.redirect(url.original);
});

app.get("/urls/:shortId", async (req, res) => {
  const { shortId } = req.params;
  const url = await prisma.url.findUnique({ where: { shortId } });
  if (!url) return res.status(404).send("URL não encontrada");

  res.json({
    original: url.original,
    shortId: url.shortId,
    clicks: url.clicks,
    qrCode: url.qrCode,
    expiresAt: url.expiresAt,
  });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
