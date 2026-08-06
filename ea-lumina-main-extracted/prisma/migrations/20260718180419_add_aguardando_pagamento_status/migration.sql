-- Migration: add_aguardando_pagamento_status
ALTER TYPE "AppointmentStatus" ADD VALUE IF NOT EXISTS 'AGUARDANDO_PAGAMENTO' BEFORE 'PENDENTE';
