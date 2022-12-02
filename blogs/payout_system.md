# Adding new payment provider to Sharetribe Flex (Part 2) - Payout System

Paying out to the provider is always a vital part in creating a marketplace, because it served big incentive for a provider to join your marketplace. But because Sharetribe Flex is using Stripe, it creates a big technical barrier for provider outside of Stripe's supported countries. For a more up-to-dated list, you can refer to [Stripe's doc](https://stripe.com/docs/connect/custom-accounts#requirements).

Here is the current supported countries in time this articles was written:

> Australia, Austria, Belgium, Brazil, Bulgaria, Canada, Cyprus, the Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hong Kong, Hungary, India, Ireland, Italy, Japan, Latvia, Lithuania, Luxembourg, Malta, Mexico, the Netherlands, New Zealand, Norway, Poland, Portugal, Romania, Singapore, Slovakia, Slovenia, Spain, Sweden, Switzerland, Thailand, the United Kingdom, and the United States.

As you can see, this leave out a big part of `Asia` and `Africa`. And not only that, we are live in a flat world where the money flow excessively, having and edge over the received money time would play a crucial part for business. That's why services such as Paypal has become a dominant force over the years. `Stripe connect` only allow us to create payout via the provider's `bank account`. This might also contribute to indecisiveness of a provider when they try to onboard. 

So how can we supported providers from countries/regions that Sharetribe Flex has not supported yet? And how can we make it convenient for our marketplace provider to quickly onboard, received their shared of hard work and help spread the words on our marketplace?

The answer would be to integrate with a `payout service provider`. Here is a list of payout service provider that we have been working and tested with, you can take reference from it if needed:
- [Paypal](https://www.paypal.com/)
- [Wise](https://wise.com/)
- [Payoneer](https://www.payoneer.com/)
- Crypto Payment (Solana and Near)

These are the steps that we want to take to proceed with this:
1) Select a service provider
2) Understanding a high-level concept of payment system and payout system work together
3) Understanding of what is needed to make a payout system communicate effectively Sharetribe Flex
4) Possible Risks

I would skip (1) since it depends heavily on your needs, if you ever need any consulting on what services is suitable for your marketplace, please don't hesitate to reach out to me at `tam.vu@journeyh.io`. 

## Relationship between a payment and payout system 

```
C4Context
  title System Context diagram for relationship between STFlex payment system and STFlex payout system
  Enterprise_Boundary(b0, "SystemBoundary") {
    Person(customerA, "Customer A", "A customer of the marketplace with created marketplace accounts.")
    Person(customerB, "Customer B", "A customer of the marketplace with created marketplace accounts.")

    Person(providerA, "Provider A", "A provider of the marketplace with created marketplace accounts.")
    Person(providerB, "Provider B", "A provider of the marketplace with created marketplace accounts.")

    System(FlexSite, "Marketplace website", "Allows customers to view 
    information of existing listings and make payments.")

    System(FlexBackend, "Flex Backend")

    System(PaymentSystem, "Payment System", "Our custom payment system.")

    System(PayoutSystem, "Payout System", "Our custom payout system.")

    Rel(customerA, FlexSite, "View listings")
    Rel(customerB, FlexSite, "Make Payment")

    Rel(providerA, FlexSite, "Create Listing")
    Rel(providerB, FlexSite, "Add payout details")

    Rel(FlexSite, PaymentSystem, "Process Transaction")
    Rel(PaymentSystem, PayoutSystem, "Set Payout Schedule")
    Rel(PayoutSystem, FlexBackend, "Fetch Information for Creating Payout")
    Rel(PayoutSystem, providerB, "Payout")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
  }
```

**Diagram 1**: C4 model System Context diagram for relationship between STFlex payment

In this article, we would assume that you have set up a `payment service` as article 1 (**TODO: insert link article 1**) has suggested. Here is how it should works at a high level:

1) When you onboard a provider, after creating a listing, they will input their payout information, it could be their email, their Paypal account, their bank account or the address of their crypto wallet.
2) Depends on your process, after a while, the provider's listing would be put on the `Search Page` for every one to look
3) When a customer wants to buy a listing, they can choose whatever payment method that they prefer
4) When a payment has been created and confirmed, the money would be transferred from the customer's bank to the bank account of the `payout service provider` that we choose
5) From the centralized placed provided by our payout service provider. Our code would react to Sharetribe Flex transaction event and issue payout accordingly
6) The payout would arrive depends on the provider's preferred payout method (Paypal, Bank account, ...etc)

There are couple of note I would like to stretch on the above flow:
- For `number 3`, you do not need to fixed yourself with a payment provider and payout provider being the same service. Because most payout service out there would give you a good amount of method to transfer money from one platform to another automatically. 
- Having a separation of concern of payment provider and payout provider gave you a tremendous edge over selecting the best offer for your marketplace as most payment provider all take a percentage cut on all of your transaction. Choose the payment provider and payout provider that offers the lowest cost would be extremely beneficial for the marketplace financing.
- For `number 4`, you would still create a transaction on STFlex for the purpose of recording the transaction and make us of STFlex transaction state machine for creating a systematic transaction process. We only cut Stripe integration from existing STFlex transaction integration.

## Payout System

Now that we have a better grasped of what is going on high-level, let's dive more into our payout system, and what it consist of

```
C4Context
  title System Context diagram for STFlex payout system
  Enterprise_Boundary(b0, "SystemBoundary") {
    Person(providerA, "Provider A", "A provider of the marketplace with created marketplace accounts.")

    System(PaymentSystem, "White labelled Payment Processing Service", "Our backend for processing money")

    System_Ext(FlexTransactionBackend, "Flex Backend", "STFlex backend for handling transaction.") 

    Enterprise_Boundary(b1, "PayoutSystem") {
     System(PayoutProcessingService, "White labelled Payout Processing Service", "Our backend for paying money out") 

     System_Ext(ThirdPartyPayoutProcessingService, "Payment Processing Service", "The payment service that we choose to integrate with such as Stripe, Paypal,...etc") 

     System(EventListener, "Transaction Event Listener", "Our backend for listening to upcoming Flex transaction events using integration SDK. We would only take transaction that start transitioning to states that needs payout") 
    }

    Rel(PaymentSystem, FlexTransactionBackend, "Record transaction/change transaction metadata", "Integration SDK")
    Rel(EventListener, FlexTransactionBackend, "Query new events in a set interval to find new transaction events that requires paying out")
    Rel(EventListener, PayoutProcessingService, "Trigger payout command for corresponding transaction")
    Rel(PayoutProcessingService, FlexTransactionBackend, "Get the newest transaction data on STFlex/confirm the payout amount has been sent")
    Rel(PayoutProcessingService, ThirdPartyPayoutProcessingService, "Initiate payout", "Using payout service provider SDK")
    Rel(EventListener, ThirdPartyPayoutProcessingService, "Listen to payout success event")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
  }
```

**Diagram 2**: C4 model System Context diagram for STFlex payout system

As the diagram has suggested, to implement a payout system on STFlex these are the system you need to add:
- **Event listener service**: The purpose is for listening to STFlex transaction events for the code to release the payout money in the correct moment with the web.
- **Existing payment service**: This be done in part 1
- **A service for paying out**: In reality, this could be a quick Lambda function or Google cloud function that has some SDK codes that can call to `STFlex for transaction data` and call to `Payout provider for creating payout`. If your business requires better failed payout handler, you can add those logic in here.

The flow of the payout system should be like this:
1) Buyer create transaction and payment via the desired payment provider
2) We create a STFlex transaction to record
3) A webhook is added to our server, it will wait for hook from the payout service provider to update STFLex transaction status in their metadata
4) Your business flow for each transaction kicks out as normal
5) When the payout steps is needed, STFlex transaction would based on your configuration rules and transit to the correspond state
6) Our event listener would detect there are new and valid transaction that needs payout
7) The event listener would then trigger our payout service to determine the payout amount
8) Our payout service would use the external payout service provider and fire off the payout amount
9) A webhook would be fired back from the external payout service provider or if the payout service provider does not have webhook, we would use our event listener to listen to payout success event
10) The transaction data would be updated with the payout success state


**Footer**
If you have any questions or want to contact us for help and reduce the development time, please feel free to email `tam.vu@journeyh.io`
