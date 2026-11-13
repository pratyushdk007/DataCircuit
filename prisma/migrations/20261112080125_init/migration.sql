-- CreateTable
CREATE TABLE "AcceptedEvent" (
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderId" TEXT NOT NULL,
    "amountPaise" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "payload" JSONB NOT NULL,

    CONSTRAINT "AcceptedEvent_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "QuarantinedEvent" (
    "id" TEXT NOT NULL,
    "eventId" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reasons" TEXT[],
    "rawEvent" JSONB NOT NULL,

    CONSTRAINT "QuarantinedEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AcceptedEvent_receivedAt_idx" ON "AcceptedEvent"("receivedAt");

-- CreateIndex
CREATE INDEX "AcceptedEvent_orderId_idx" ON "AcceptedEvent"("orderId");

-- CreateIndex
CREATE INDEX "QuarantinedEvent_eventId_idx" ON "QuarantinedEvent"("eventId");

-- CreateIndex
CREATE INDEX "QuarantinedEvent_receivedAt_idx" ON "QuarantinedEvent"("receivedAt");
