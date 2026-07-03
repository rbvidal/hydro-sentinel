package com.hydrosentinel.domain.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

/**
 * A person or role configured to receive alert notifications.
 */
@Entity
@Table(name = "alert_recipients")
public class AlertRecipient {

    @Id
    private String id;

    @NotBlank
    private String name;

    private String role;
    private String email;
    private String phone;

    private boolean notifyCritical = true;
    private boolean notifyWarning = true;

    private String lastTested;

    /** No-arg constructor for JPA. */
    public AlertRecipient() {}

    /**
     * Creates a fully-populated AlertRecipient.
     *
     * @param id unique recipient identifier
     * @param name recipient display name
     * @param role recipient role or title
     * @param email email address for notifications
     * @param phone phone number for notifications
     * @param notifyCritical whether to notify for critical alerts
     * @param notifyWarning whether to notify for warning alerts
     * @param lastTested human-readable timestamp of the last notification test
     */
    public AlertRecipient(String id, String name, String role, String email, String phone,
                          boolean notifyCritical, boolean notifyWarning, String lastTested) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.email = email;
        this.phone = phone;
        this.notifyCritical = notifyCritical;
        this.notifyWarning = notifyWarning;
        this.lastTested = lastTested;
    }

    /** @return the recipient's unique identifier. */
    public String getId() { return id; }
    /** @param id the unique identifier to set. */
    public void setId(String id) { this.id = id; }

    /** @return the recipient's display name. */
    public String getName() { return name; }
    /** @param name the display name to set. */
    public void setName(String name) { this.name = name; }

    /** @return the recipient's role or title. */
    public String getRole() { return role; }
    /** @param role the role or title to set. */
    public void setRole(String role) { this.role = role; }

    /** @return the recipient's email address for notifications. */
    public String getEmail() { return email; }
    /** @param email the email address to set. */
    public void setEmail(String email) { this.email = email; }

    /** @return the recipient's phone number for notifications. */
    public String getPhone() { return phone; }
    /** @param phone the phone number to set. */
    public void setPhone(String phone) { this.phone = phone; }

    /** @return whether the recipient should be notified for critical alerts. */
    public boolean isNotifyCritical() { return notifyCritical; }
    /** @param notifyCritical whether to notify for critical alerts. */
    public void setNotifyCritical(boolean notifyCritical) { this.notifyCritical = notifyCritical; }

    /** @return whether the recipient should be notified for warning alerts. */
    public boolean isNotifyWarning() { return notifyWarning; }
    /** @param notifyWarning whether to notify for warning alerts. */
    public void setNotifyWarning(boolean notifyWarning) { this.notifyWarning = notifyWarning; }

    /** @return the human-readable timestamp of the last notification test. */
    public String getLastTested() { return lastTested; }
    /** @param lastTested the last-tested timestamp to set. */
    public void setLastTested(String lastTested) { this.lastTested = lastTested; }
}
