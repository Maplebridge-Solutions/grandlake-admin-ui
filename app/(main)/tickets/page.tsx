"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Ticket, RefreshCcw, CreditCard, Settings, Plus } from "lucide-react";
import TransactionList from "@/components/tickets/transaction-list";
import TicketTypeList from "@/components/tickets/ticket-type-list";
import RefundManagement from "@/components/tickets/refund-management";
import PassManagement from "@/components/tickets/pass-management";
import RefundSettings from "@/components/tickets/refund-settings";
import CreateTicketTypeModal from "@/components/tickets/create-ticket-type-modal";
import IssuePassModal from "@/components/tickets/issue-pass-modal";
import type { TicketViewState } from "@/lib/types/tickets";

export default function TicketsPaymentsPage() {
  const [view, setView] = useState<TicketViewState>("transactions");
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [isIssuePassModalOpen, setIsIssuePassModalOpen] = useState(false);
  const [ticketListRefreshKey, setTicketListRefreshKey] = useState(0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-content-primary tracking-tight">
            Tickets & Payment
          </h1>
          <p className="text-content-muted mt-1">
            Create and manage tickets, transactions here
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {view === "transactions" && (
            <>
              <Button
                variant="outline"
                className="rounded-2xl border-brand text-brand hover:bg-brand-light font-bold h-11"
                onClick={() => setView("refunds")}
              >
                <RefreshCcw size={18} className="mr-2" />
                Manage Refunds
              </Button>
              <Button
                className="bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold h-11 shadow-lg shadow-brand/20"
                onClick={() => setView("ticket-types")}
              >
                <Ticket size={18} className="mr-2" />
                All Tickets
              </Button>
            </>
          )}

          {view === "ticket-types" && (
            <>
              {/* <Button
                variant="outline"
                className="rounded-2xl border-brand text-brand hover:bg-brand-light font-bold h-11"
                onClick={() => setView("passes")}
              >
                <CreditCard size={18} className="mr-2" />
                Manage Passes
              </Button> */}
              <Button
                className="bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold h-11 shadow-lg shadow-brand/20"
                onClick={() => setIsCreateTicketModalOpen(true)}
              >
                <Ticket size={18} className="mr-2" />
                Create Ticket Types
              </Button>
            </>
          )}

          {/* {view === "refunds" && (
            <Button
              variant="outline"
              className="rounded-2xl border-brand text-brand hover:bg-brand-light font-bold h-11"
              onClick={() => setView("refund-settings")}
            >
              <Settings size={18} className="mr-2" />
              Refund Auto-Settings
            </Button>
          )} */}

          {/* {view === "passes" && (
            <Button
              className="bg-brand hover:bg-brand/90 text-white rounded-2xl font-bold h-11 shadow-lg shadow-brand/20"
              onClick={() => setIsIssuePassModalOpen(true)}
            >
              <Plus size={18} className="mr-2" />
              Issue New Pass
            </Button>
          )} */}
        </div>
      </div>

      {/* Navigation Breadcrumb-like or Back button for sub-views */}
      {view !== "transactions" && (
        <Button
          variant="ghost"
          className="text-content-muted hover:text-brand -ml-2"
          onClick={() => {
            if (view === "refund-settings") setView("refunds");
            else setView("transactions");
          }}
        >
          ← Back to{" "}
          {view === "refund-settings" ? "Refunds" : "Tickets & Payment"}
        </Button>
      )}

      {/* Main Content Area */}
      <div className="bg-white border border-surface-subtle rounded-2xl sm:rounded-[32px] p-4 sm:p-6 shadow-sm min-h-[600px]">
        {view === "transactions" && <TransactionList />}
        {view === "ticket-types" && (
          <TicketTypeList onCreated={ticketListRefreshKey} />
        )}
        {view === "refunds" && <RefundManagement />}
        {view === "passes" && (
          <PassManagement onIssueNew={() => setIsIssuePassModalOpen(true)} />
        )}
        {view === "refund-settings" && <RefundSettings />}
      </div>

      {/* Modals */}
      <CreateTicketTypeModal
        isOpen={isCreateTicketModalOpen}
        onClose={() => setIsCreateTicketModalOpen(false)}
        onSuccess={() => setTicketListRefreshKey((k) => k + 1)}
      />
      <IssuePassModal
        isOpen={isIssuePassModalOpen}
        onClose={() => setIsIssuePassModalOpen(false)}
      />
    </div>
  );
}
